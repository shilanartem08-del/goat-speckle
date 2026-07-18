-- =====================================================================
-- Goat Speckle: таблицы для отзывов (с фото) и галереи работ
-- Выполните этот скрипт в SQL Editor ПОСЛЕ schema.sql и schema_02_content.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Таблица ОТЗЫВОВ
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  photo_url text,                              -- ссылка на фото в Supabase Storage (необязательно)
  sort_order integer not null default 0,       -- порядок отображения (меньше = выше)
  is_visible boolean not null default true     -- показывать ли на сайте
);

alter table public.reviews enable row level security;

-- Любой посетитель сайта может ЧИТАТЬ только видимые отзывы
create policy "Anyone can view visible reviews"
  on public.reviews
  for select
  to anon
  using (is_visible = true);

-- Авторизованный пользователь (админ) может делать всё
create policy "Authenticated users can view all reviews"
  on public.reviews
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update reviews"
  on public.reviews
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete reviews"
  on public.reviews
  for delete
  to authenticated
  using (true);


-- ---------------------------------------------------------------------
-- Таблица ГАЛЕРЕИ РАБОТ
-- ---------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text,                                  -- необязательная подпись к фото
  photo_url text not null,                     -- ссылка на фото в Supabase Storage
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

alter table public.gallery enable row level security;

create policy "Anyone can view visible gallery items"
  on public.gallery
  for select
  to anon
  using (is_visible = true);

create policy "Authenticated users can view all gallery items"
  on public.gallery
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert gallery items"
  on public.gallery
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update gallery items"
  on public.gallery
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete gallery items"
  on public.gallery
  for delete
  to authenticated
  using (true);


-- =====================================================================
-- ВАЖНО: после выполнения этого SQL-скрипта нужно ОТДЕЛЬНО создать
-- два публичных бакета в разделе Storage интерфейса Supabase:
--   1. review-photos   — для фото к отзывам
--   2. gallery-photos  — для фото галереи работ
-- Инструкция — в README.md, раздел "Настройка Supabase Storage".
-- =====================================================================

-- Политики доступа к файлам в Storage (выполняются автоматически,
-- если бакеты созданы как Public — см. README). Эти политики нужны
-- ТОЛЬКО если вы создали бакеты как приватные и хотите настроить
-- доступ через SQL вместо галочки "Public" в интерфейсе.
--
-- create policy "Anyone can view review photos"
--   on storage.objects for select
--   to anon
--   using (bucket_id = 'review-photos');
--
-- create policy "Authenticated users can upload review photos"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'review-photos');
--
-- create policy "Authenticated users can delete review photos"
--   on storage.objects for delete
--   to authenticated
--   using (bucket_id = 'review-photos');
--
-- (аналогичные политики нужно продублировать для bucket_id = 'gallery-photos')
