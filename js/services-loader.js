// ===================== ДИНАМИЧЕСКАЯ ЗАГРУЗКА ПРАЙС-ЛИСТА =====================
// Если подключение к Supabase работает — перестраиваем таблицы услуг
// по данным из базы (сгруппированные по категориям).
// Если Supabase недоступен или в базе пока нет данных — остаётся
// статичный прайс-лист, зашитый в HTML на момент публикации сайта.

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("services-container");
  if (!container || typeof supabaseClient === "undefined") return;

  try {
    const { data, error } = await supabaseClient
      .from("services")
      .select("*")
      .eq("is_visible", true)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return; // оставляем статичный контент как есть

    // Группируем по категории, сохраняя порядок первого появления
    const categories = [];
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
        categories.push(item.category);
      }
      grouped[item.category].push(item);
    });

    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }

    const html = categories
      .map((category) => {
        const rows = grouped[category]
          .map(
            (item) =>
              `<tr><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.price_text)}</td></tr>`
          )
          .join("");

        return `
          <h2 class="section-title">${escapeHtml(category)}</h2>
          <table class="price-table">
            <tr><th>Услуга</th><th>Цена</th></tr>
            ${rows}
          </table>
        `;
      })
      .join('<div style="height: 40px;"></div>');

    container.innerHTML = html;
  } catch (err) {
    console.error("Не удалось загрузить прайс-лист из базы:", err);
    // Оставляем статичный контент без изменений
  }
});
