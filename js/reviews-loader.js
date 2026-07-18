// ===================== ДИНАМИЧЕСКАЯ ЗАГРУЗКА ОТЗЫВОВ =====================
// Подгружает отзывы клиентов из базы данных Supabase и строит карточки
// с рейтингом-звёздами, фото (если есть) и общим средним рейтингом наверху.

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("reviews-container");
  if (!container || typeof supabaseClient === "undefined") return;

  const starPath = "M12 2.5 14.9 8.4 21.4 9.4 16.7 14 17.8 20.5 12 17.4 6.2 20.5 7.3 14 2.6 9.4 9.1 8.4Z";

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function starsHtml(rating, outOfFive = 5) {
    let html = "";
    for (let i = 1; i <= outOfFive; i++) {
      const filled = i <= Math.round(rating);
      html += `<svg class="icon-svg${filled ? "" : " star-empty"}" viewBox="0 0 24 24"><path d="${starPath}"/></svg>`;
    }
    return html;
  }

  try {
    const { data, error } = await supabaseClient
      .from("reviews")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      container.innerHTML = `
        <p style="grid-column: 1/-1; text-align:center; color: var(--color-muted);">
          Отзывы скоро появятся здесь.
        </p>
      `;
      return;
    }

    // Средний рейтинг для сводки наверху страницы
    const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
    const summaryEl = document.getElementById("reviews-summary");
    if (summaryEl) {
      document.getElementById("reviews-score").textContent = avgRating.toFixed(1);
      document.getElementById("reviews-summary-stars").innerHTML = starsHtml(avgRating);
      summaryEl.setAttribute("aria-label", `Средний рейтинг ${avgRating.toFixed(1)} из 5`);
      summaryEl.style.display = "flex";
    }

    const html = data
      .map((r) => {
        const initial = (r.client_name || "?").trim().charAt(0).toUpperCase();
        const photoBlock = r.photo_url
          ? `<img src="${escapeHtml(r.photo_url)}" alt="Фото к отзыву от ${escapeHtml(r.client_name)}" class="review-photo">`
          : "";

        return `
          <div class="review-card">
            <div class="review-stars" role="img" aria-label="Оценка ${r.rating} из 5">
              ${starsHtml(r.rating)}
            </div>
            <p class="review-text">«${escapeHtml(r.review_text)}»</p>
            ${photoBlock}
            <div class="review-footer">
              <div class="review-avatar" aria-hidden="true">${escapeHtml(initial)}</div>
              <div class="review-meta">
                <span class="review-name">${escapeHtml(r.client_name)}</span>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    container.innerHTML = html;
  } catch (err) {
    console.error("Не удалось загрузить отзывы из базы:", err);
    container.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color: var(--color-muted);">
        Отзывы скоро появятся здесь.
      </p>
    `;
  }
});
