// ===================== ЗАГРУЗКА ИЗОБРАЖЕНИЙ В SUPABASE STORAGE =====================
// Общая логика для загрузки фото отзывов и фото галереи работ.

const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Проверяет файл перед загрузкой (тип и размер).
 * @returns {string|null} текст ошибки, либо null если файл валиден
 */
function validateImageFile(file) {
  if (!file) return null;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Допустимые форматы: JPG, PNG, WEBP, GIF";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Файл слишком большой (макс. ${MAX_IMAGE_SIZE_MB} МБ)`;
  }
  return null;
}

/**
 * Загружает файл изображения в указанный bucket Supabase Storage
 * и возвращает публичную ссылку на него.
 *
 * @param {File} file - файл для загрузки
 * @param {string} bucket - имя bucket ("review-photos" или "gallery-photos")
 * @returns {Promise<string>} публичный URL загруженного файла
 */
async function uploadImageToStorage(file, bucket) {
  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  // Генерируем уникальное имя файла, чтобы избежать конфликтов
  // и не раскрывать оригинальное имя файла с устройства пользователя
  const ext = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error("Не удалось загрузить файл: " + uploadError.message);
  }

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Удаляет файл из Storage по его публичной ссылке.
 * Используется при удалении отзыва/фото галереи, чтобы не копить мусор в хранилище.
 *
 * @param {string} publicUrl - публичная ссылка на файл
 * @param {string} bucket - имя bucket
 */
async function deleteImageFromStorage(publicUrl, bucket) {
  if (!publicUrl) return;
  try {
    const fileName = publicUrl.split("/").pop();
    await supabaseClient.storage.from(bucket).remove([fileName]);
  } catch (err) {
    // Не критично, если удаление файла не удалось — сама запись
    // в базе данных всё равно будет удалена
    console.warn("Не удалось удалить файл из хранилища:", err);
  }
}
