// ===================== НАСТРОЙКИ ПОДКЛЮЧЕНИЯ К SUPABASE =====================
// Заполните эти два значения данными из вашего проекта Supabase:
// Project Settings → API → Project URL и anon public key
//
// Эти ключи публичные и безопасные для размещения в браузерном коде —
// они не дают доступа на удаление данных или к паролям,
// доступ ограничен политиками (RLS), настроенными в supabase/schema.sql

const SUPABASE_URL = "ВСТАВЬТЕ_СЮДА_PROJECT_URL"; // например: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "ВСТАВЬТЕ_СЮДА_ANON_KEY";

// Не редактируйте строки ниже
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
