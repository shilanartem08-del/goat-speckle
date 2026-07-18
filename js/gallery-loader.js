// ===================== ДИНАМИЧЕСКАЯ ЗАГРУЗКА ГАЛЕРЕИ РАБОТ =====================
// Подгружает фото работ из базы данных Supabase и открывает их
// в полноэкранном просмотре (lightbox) по клику.

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("gallery-container");
  if (!container || typeof supabaseClient === "undefined") return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function setupLightbox() {
    const overlay = document.getElementById("lightbox-overlay");
    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const closeBtn = document.getElementById("lightbox-close");
    if (!overlay) return;

    function openLightbox(src, title) {
      image.src = src;
      image.alt = title || "Фото работы";
      caption.textContent = title || "";
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeLightbox();
    });

    document.querySelectorAll(".gallery-item img").forEach((img) => {
      img.addEventListener("click", () => openLightbox(img.src, img.dataset.title));
    });
  }

  try {
    const { data, error } = await supabaseClient
      .from("gallery")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      container.innerHTML = `
        <p style="grid-column: 1/-1; text-align:center; color: var(--color-muted);">
          Фотографии работ скоро появятся здесь.
        </p>
      `;
      return;
    }

    const html = data
      .map(
        (item) => `
          <div class="gallery-item">
            <img
              src="${escapeHtml(item.photo_url)}"
              alt="${escapeHtml(item.title || "Пример работы Goat Speckle")}"
              data-title="${escapeHtml(item.title || "")}"
              loading="lazy"
            >
            ${item.title ? `<p class="gallery-item-caption">${escapeHtml(item.title)}</p>` : ""}
          </div>
        `
      )
      .join("");

    container.innerHTML = html;
    setupLightbox();
  } catch (err) {
    console.error("Не удалось загрузить галерею из базы:", err);
    container.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color: var(--color-muted);">
        Фотографии работ скоро появятся здесь.
      </p>
    `;
  }
});
