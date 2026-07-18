// ===================== COOKIE-УВЕДОМЛЕНИЕ (152-ФЗ) =====================
// Показывает баннер о cookie при первом визите. Требование российского
// законодательства (152-ФЗ) — информировать пользователя об использовании
// cookie и давать возможность согласиться либо отказаться (opt-out),
// а не просто показывать кнопку "Принять".

(function () {
  const STORAGE_KEY = "goat_speckle_cookie_consent";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // localStorage может быть недоступен (приватный режим и т.п.)
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      // если localStorage недоступен — баннер будет показываться повторно,
      // но это не критично, сайт продолжит работать
    }
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Уведомление об использовании файлов cookie");
    banner.innerHTML = `
      <div class="cookie-banner-inner">
        <p class="cookie-banner-text">
          Мы используем файлы cookie, необходимые для корректной работы сайта
          (например, для работы меню и панели управления). Подробнее — в
          <a href="privacy-policy.html">политике обработки персональных данных</a>.
        </p>
        <div class="cookie-banner-actions">
          <button type="button" class="btn btn-outline cookie-btn-decline" id="cookie-decline-btn">Отклонить</button>
          <button type="button" class="btn btn-primary cookie-btn-accept" id="cookie-accept-btn">Принять</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Небольшая задержка перед появлением — плавная анимация, не мешает
    // первому взаимодействию пользователя со страницей
    requestAnimationFrame(() => {
      banner.classList.add("visible");
    });

    document.getElementById("cookie-accept-btn").addEventListener("click", () => {
      setConsent("accepted");
      hideBanner(banner);
    });

    document.getElementById("cookie-decline-btn").addEventListener("click", () => {
      setConsent("declined");
      hideBanner(banner);
      // Технические cookie (меню, вход в админку) необходимы для работы сайта
      // и не требуют согласия по закону, поэтому продолжают использоваться
      // даже при отказе — отключаются только нетехнические cookie
      // (аналитика/реклама), которых на сайте сейчас нет.
    });
  }

  function hideBanner(banner) {
    banner.classList.remove("visible");
    setTimeout(() => banner.remove(), 300);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!getConsent()) {
      createBanner();
    }
  });
})();
