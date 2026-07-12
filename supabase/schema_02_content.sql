-- =====================================================================
-- Goat Speckle: таблицы для управления контентом (услуги/цены, новости)
-- Выполните этот скрипт в SQL Editor ПОСЛЕ основного schema.sql
-- =====================================================================

-- ---------------------------------------------------------------------
-- Таблица УСЛУГ / ПРАЙС-ЛИСТА
-- ---------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null default 'Маникюр',   -- название раздела прайса (например "Маникюр")
  title text not null,                         -- название услуги
  price_text text not null,                    -- цена в виде текста, например "1500 ₽" или "от 1900 ₽"
  sort_order integer not null default 0,       -- порядок отображения (меньше = выше)
  is_visible boolean not null default true     -- показывать ли на сайте
);

alter table public.services enable row level security;

-- Любой посетитель сайта может ЧИТАТЬ только видимые услуги
create policy "Anyone can view visible services"
  on public.services
  for select
  to anon
  using (is_visible = true);

-- Авторизованный пользователь (админ) может делать всё
create policy "Authenticated users can view all services"
  on public.services
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert services"
  on public.services
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update services"
  on public.services
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete services"
  on public.services
  for delete
  to authenticated
  using (true);

-- Наполняем таблицу текущим прайсом с сайта
insert into public.services (category, title, price_text, sort_order) values
  ('Маникюр', 'Классический (обрезной) маникюр без покрытия', '900 ₽', 1),
  ('Маникюр', 'Классический маникюр + покрытие гель-лак (1 тон)', '1500 ₽', 2),
  ('Маникюр', 'Аппаратный маникюр + покрытие гель-лак', '1700 ₽', 3),
  ('Маникюр', 'Снятие старого покрытия', '300 ₽', 4),
  ('Маникюр', 'Укрепление ногтей (биогель / полигель)', 'от 1900 ₽', 5),
  ('Маникюр', 'Наращивание ногтей (гель, любая форма)', 'от 2500 ₽', 6);


-- ---------------------------------------------------------------------
-- Таблица НОВОСТЕЙ
-- ---------------------------------------------------------------------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  published_at date not null default current_date, -- дата, которая показывается на сайте
  title text not null,
  body text not null,
  link_url text,                 -- необязательная ссылка "подробнее" (например на Telegram-канал)
  link_label text default 'Подробнее',
  is_visible boolean not null default true
);

alter table public.news enable row level security;

create policy "Anyone can view visible news"
  on public.news
  for select
  to anon
  using (is_visible = true);

create policy "Authenticated users can view all news"
  on public.news
  for select
  to authenticated
  using (true);

create policy "Authenticated users can insert news"
  on public.news
  for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update news"
  on public.news
  for update
  to authenticated
  using (true);

create policy "Authenticated users can delete news"
  on public.news
  for delete
  to authenticated
  using (true);

-- Наполняем таблицу текущими новостями с сайта
insert into public.news (title, body, published_at, link_url, link_label) values
  ('Запустили сайт Goat Speckle!', 'Теперь записаться на маникюр можно онлайн: смотрите услуги, цены и оставляйте заявку прямо на сайте.', '2026-07-10', null, 'Подробнее'),
  ('Скидка 15% на первый визит', 'Для новых клиенток — скидка на любую услугу маникюра при первом посещении.', '2026-07-01', null, 'Подробнее'),
  ('Мы в Telegram', 'Подписывайтесь на наш телеграм-канал — там первыми узнаете об акциях и свободных окошках.', '2026-05-22', 'https://t.me/+oBoILEmNnMFiZjgy', 'Перейти в канал');
