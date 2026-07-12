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
//
// ВАЖНО: у библиотеки supabase-js есть известная проблема — она использует
// браузерный Navigator Locks API для синхронизации между вкладками, и эта
// блокировка иногда "зависает" навсегда (особенно при нескольких открытых
// вкладках админки), из-за чего ЛЮБОЙ запрос к базе данных виснет без единой
// ошибки в сети. Ниже — рекомендованный официальный обход: своя простая
// реализация лока без использования navigator.locks.
// См. https://github.com/supabase/supabase-js/issues/2013
const simpleLock = async (name, acquireTimeout, fn) => {
  return await fn();
};

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    lock: simpleLock,
  },
});
