// ===================== ДИНАМИЧЕСКАЯ ЗАГРУЗКА НОВОСТЕЙ =====================
// Если подключение к Supabase работает — перестраиваем карточки новостей
// по данным из базы. Если Supabase недоступен или в базе пока нет данных —
// остаются статичные карточки, зашитые в HTML на момент публикации сайта.

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("news-container");
  if (!container || typeof supabaseClient === "undefined") return;

  // Универсальная иконка "объявление" для новостей из базы
  const defaultIcon = `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M4 10v4h3l6 4V6l-6 4H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>`;

  try {
    const { data, error } = await supabaseClient
      .from("news")
      .select("*")
      .eq("is_visible", true)
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) return; // оставляем статичный контент как есть

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str == null ? "" : str;
      return div.innerHTML;
    }

    // Защита от XSS через javascript:/data: URI в поле "Ссылка" —
    // escapeHtml() экранирует HTML-спецсимволы, но не проверяет схему
    // самого URL, поэтому это отдельная, обязательная проверка.
    function sanitizeUrl(url) {
      if (!url) return "#";
      const trimmed = url.trim();
      // protocol-relative ссылки (//evil.com) не считаем безопасными:
      // хотя это не XSS, это может увести пользователя на сторонний домен
      // под видом ссылки на наш сайт
      if (trimmed.startsWith("//")) return "#";
      try {
        const parsed = new URL(trimmed, window.location.origin);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          return trimmed;
        }
      } catch (e) {
        // некорректный URL — считаем небезопасным
      }
      return "#";
    }

    function formatDate(isoDate) {
      const d = new Date(isoDate + "T00:00:00");
      return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    }

    const html = data
      .map((item) => {
        const linkHref = sanitizeUrl(item.link_url);
        const targetAttrs = linkHref !== "#" ? ' target="_blank" rel="noopener"' : "";
        const linkLabel = escapeHtml(item.link_label || "Подробнее");

        return `
          <article class="post-card">
            <div class="post-thumb">${defaultIcon}</div>
            <div class="post-body">
              <div class="post-date">${formatDate(item.published_at)}</div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
              <a href="${escapeHtml(linkHref)}"${targetAttrs} class="read-more">${linkLabel} →</a>
            </div>
          </article>
        `;
      })
      .join("");

    container.innerHTML = html;
  } catch (err) {
    console.error("Не удалось загрузить новости из базы:", err);
    // Оставляем статичный контент без изменений
  }
});
