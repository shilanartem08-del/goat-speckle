// ===================== ОБЩАЯ ЛОГИКА ДЛЯ СТРАНИЦ АДМИНКИ =====================

// Показывает заметный баннер с ошибкой прямо на странице —
// чтобы проблему было видно без консоли разработчика (важно на мобильных).
function showAdminError(message) {
  let banner = document.getElementById("admin-error-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "admin-error-banner";
    banner.style.cssText = [
      "margin: 20px",
      "padding: 16px 20px",
      "background: #fee2e2",
      "color: #991b1b",
      "border: 2px solid #991b1b",
      "border-radius: 12px",
      "font-weight: 700",
      "white-space: pre-wrap",
      "word-break: break-word",
    ].join(";");
    const main = document.getElementById("main-content") || document.body;
    main.prepend(banner);
  }
  banner.textContent = "⚠ " + message;
}

// Ловим вообще любые непредвиденные ошибки JS на странице
window.addEventListener("error", (e) => {
  showAdminError("Ошибка на странице: " + (e.message || e));
});
window.addEventListener("unhandledrejection", (e) => {
  const reason = e.reason && e.reason.message ? e.reason.message : String(e.reason);
  showAdminError("Ошибка запроса: " + reason);
});

// Проверяем, что библиотека Supabase вообще загрузилась
// (может не загрузиться из-за проблем с интернетом, блокировщиков и т.п.)
if (typeof window.supabase === "undefined") {
  showAdminError(
    "Не удалось загрузить библиотеку Supabase. Проверьте интернет-соединение, отключите блокировщики рекламы для этого сайта и обновите страницу."
  );
}

// Оборачиваем промис в таймаут, чтобы запрос не "зависал" молча навсегда
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Превышено время ожидания ответа (${label})`)), ms)
    ),
  ]);
}

async function requireAuth() {
  try {
    const { data, error } = await withTimeout(
      supabaseClient.auth.getSession(),
      10000,
      "проверка входа"
    );
    if (error) {
      showAdminError("Ошибка проверки сессии: " + error.message);
      return null;
    }
    if (!data.session) {
      window.location.href = "login.html";
      return null;
    }
    const emailEl = document.getElementById("user-email");
    if (emailEl) emailEl.textContent = data.session.user.email;
    return data.session;
  } catch (err) {
    showAdminError("Не удалось проверить вход: " + err.message);
    return null;
  }
}

function setupLogout() {
  const btn = document.getElementById("logout-btn");
  if (btn) {
    btn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "login.html";
    });
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateOnly(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}
