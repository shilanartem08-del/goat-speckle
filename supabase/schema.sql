-- Таблица заявок с сайта Goat Speckle
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'done', 'cancelled'))
);

-- Включаем защиту на уровне строк (Row Level Security)
alter table public.bookings enable row level security;

-- Разрешаем ЛЮБОМУ посетителю сайта СОЗДАВАТЬ заявку (отправка формы)
create policy "Anyone can submit a booking"
  on public.bookings
  for insert
  to anon
  with check (true);

-- Читать и менять заявки может только авторизованный пользователь (админ)
create policy "Authenticated users can view bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

create policy "Authenticated users can update bookings"
  on public.bookings
  for update
  to authenticated
  using (true);
