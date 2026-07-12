// ===================== GOAT SPECKLE — общий скрипт =====================

document.addEventListener("DOMContentLoaded", () => {
  // Мобильное меню
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    // закрывать меню при клике на ссылку (мобильная версия)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // Подсветка активного пункта меню
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // Обработка формы обратной связи
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name").value.trim();
      const phone = form.querySelector("#phone").value.trim();
      const message = form.querySelector("#message").value.trim();

      if (!name || !phone) {
        alert("Пожалуйста, заполните имя и телефон 🐐");
        return;
      }

      // Формируем текст письма и открываем почтовый клиент пользователя
      const subject = encodeURIComponent("Заявка с сайта Goat Speckle");
      const body = encodeURIComponent(
        `Имя: ${name}\nТелефон: ${phone}\nСообщение: ${message || "—"}`
      );

      window.location.href = `mailto:shilanartem08@gmail.com?subject=${subject}&body=${body}`;

      const successMsg = document.getElementById("form-success");
      if (successMsg) {
        successMsg.style.display = "block";
      }
      form.reset();
    });
  }
});
