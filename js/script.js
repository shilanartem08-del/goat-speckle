// ===================== GOAT SPECKLE — общий скрипт =====================

document.addEventListener("DOMContentLoaded", () => {
  // Мобильное меню
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    // закрывать меню при клике на ссылку (мобильная версия)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Открыть меню");
      });
    });

    // закрывать меню по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Открыть меню");
        toggle.focus();
      }
    });
  }

  // Подсветка активного пункта меню
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Обработка формы обратной связи
  const form = document.getElementById("contact-form");
  if (form) {
    const nameInput = form.querySelector("#name");
    const phoneInput = form.querySelector("#phone");
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusBox = document.getElementById("form-status");

    function showFieldError(input, message) {
      input.classList.add("field-error");
      input.setAttribute("aria-invalid", "true");
      const errorEl = document.getElementById(input.id + "-error");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("visible");
      }
    }

    function clearFieldError(input) {
      input.classList.remove("field-error");
      input.removeAttribute("aria-invalid");
      const errorEl = document.getElementById(input.id + "-error");
      if (errorEl) {
        errorEl.classList.remove("visible");
        errorEl.textContent = "";
      }
    }

    [nameInput, phoneInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => clearFieldError(input));
      }
    });

    function showStatus(type, message) {
      if (!statusBox) return;
      statusBox.textContent = message;
      statusBox.classList.remove("success", "error");
      statusBox.classList.add("visible", type);
      statusBox.setAttribute("role", "status");
    }

    // Резервный вариант через mailto, если Supabase не настроен/недоступен
    function sendViaMailto(name, phone, message) {
      const subject = encodeURIComponent("Заявка с сайта Goat Speckle");
      const body = encodeURIComponent(
        `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message || "—"}`
      );
      window.location.href = `mailto:shilanartem08@gmail.com?subject=${subject}&body=${body}`;
      showStatus(
        "success",
        "Спасибо! Сейчас откроется почтовый клиент для отправки заявки — если этого не произошло, напишите нам напрямую на shilanartem08@gmail.com."
      );
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      const message = form.querySelector("#message").value.trim();

      let hasError = false;

      if (!name) {
        showFieldError(nameInput, "Пожалуйста, укажите ваше имя");
        hasError = true;
      }

      if (!phone) {
        showFieldError(phoneInput, "Пожалуйста, укажите номер телефона");
        hasError = true;
      }

      if (hasError) {
        showStatus("error", "Проверьте, пожалуйста, обязательные поля ниже.");
        (nameInput.classList.contains("field-error") ? nameInput : phoneInput).focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Отправляем…";

      // Если на странице подключён Supabase — сохраняем заявку в базу
      if (typeof supabaseClient !== "undefined") {
        try {
          const { error } = await supabaseClient
            .from("bookings")
            .insert([{ name, phone, message: message || null }]);

          if (error) throw error;

          showStatus(
            "success",
            "Спасибо! Ваша заявка отправлена — мы свяжемся с вами в ближайшее время."
          );
          form.reset();
        } catch (err) {
          console.error("Supabase insert error:", err);
          // Если запись в базу не удалась — используем резервный вариант
          sendViaMailto(name, phone, message);
          form.reset();
        }
      } else {
        // Supabase не подключён на странице — используем mailto
        sendViaMailto(name, phone, message);
        form.reset();
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Отправить заявку";
      }, 2500);
    });
  }
});
