-- Jalankan file ini di Supabase Dashboard > SQL Editor

-- 1. Tabel karya
create table if not exists works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  year text,
  description text,
  image_url text,
  video_url text,
  pdf_url text,
  gallery_urls text[] not null default '{}',
  created_at timestamptz default now()
);

-- Kalau tabel works sudah ada duluan (dari setup versi sebelumnya), jalankan baris ini saja:
alter table works add column if not exists gallery_urls text[] not null default '{}';

-- 2. Tabel profil (hanya 1 baris)
create table if not exists profile (
  id int primary key default 1,
  name text not null default 'Nama Anda',
  role text not null default 'Peran / Jabatan',
  tagline text default '',
  about text default '',
  email text default '',
  phone text default '',
  location text default '',
  availability text default 'Terbuka untuk proyek baru',
  theme text not null default 'riso',
  constraint single_row check (id = 1)
);

-- Kalau tabel profile sudah ada duluan, jalankan baris ini saja:
alter table profile add column if not exists theme text not null default 'riso';

insert into profile (id) values (1) on conflict (id) do nothing;

-- 3. Aktifkan Row Level Security
alter table works enable row level security;
alter table profile enable row level security;

-- 4. Semua orang boleh membaca (untuk landing page publik)
create policy "public read works" on works for select using (true);
create policy "public read profile" on profile for select using (true);

-- 5. Hanya admin yang login (authenticated) boleh menulis
create policy "admin insert works" on works for insert to authenticated with check (true);
create policy "admin update works" on works for update to authenticated using (true);
create policy "admin delete works" on works for delete to authenticated using (true);
create policy "admin update profile" on profile for update to authenticated using (true);

-- 6. Tabel keahlian / software skill
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Software',
  level int not null default 3 check (level between 1 and 5),
  created_at timestamptz default now()
);

alter table skills enable row level security;

create policy "public read skills" on skills for select using (true);
create policy "admin insert skills" on skills for insert to authenticated with check (true);
create policy "admin update skills" on skills for update to authenticated using (true);
create policy "admin delete skills" on skills for delete to authenticated using (true);

-- 7. Storage bucket untuk gambar & PDF (jalankan di SQL editor juga)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "public read portfolio-media" on storage.objects
  for select using (bucket_id = 'portfolio-media');

create policy "admin upload portfolio-media" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-media');

create policy "admin delete portfolio-media" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-media');
