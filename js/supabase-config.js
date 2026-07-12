// ===================== НАСТРОЙКИ ПОДКЛЮЧЕНИЯ К SUPABASE =====================
// Заполните эти два значения данными из вашего проекта Supabase:
// Project Settings → API → Project URL и anon public key
//
// Эти ключи публичные и безопасные для размещения в браузерном коде —
// они не дают доступа на удаление данных или к паролям,
// доступ ограничен политиками (RLS), настроенными в supabase/schema.sql

const SUPABASE_URL = "https://pqbpavdsjkvofwrhysed.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYnBhdmRzamt2b2Z3cmh5c2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzkxMjgsImV4cCI6MjA5OTQ1NTEyOH0.mb97dHF7Isx7MDZmkaUQ0FLhLTXpKwzP9cpu_81dIH8";

// Не редактируйте строки ниже
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
