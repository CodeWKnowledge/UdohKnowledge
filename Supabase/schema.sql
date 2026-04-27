-- ==========================================
-- SUPABASE SCHEMA: KNOWLEDGE UDOH PORTFOLIO
-- ==========================================
-- This script is idempotent. Running it multiple times 
-- will not destroy existing data, but will ensure all 
-- required columns and policies exist.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. TABLES SETUP
-- ------------------------------------------

-- Content Table (Static Text Nodes)
create table if not exists public.content (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text not null
);

-- Projects Table (Portfolio Gallery & Case Studies)
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  details text,
  technologies text[] default '{}',
  image_url text,
  live_url text,
  github_url text,
  date text,
  type text,
  client text,
  category text[] default '{}',
  featured boolean default false,
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings Table (Global Configuration)
create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  site_name text not null,
  primary_color text not null,
  social_links jsonb default '{}'::jsonb
);

-- Admin Users Table (Authorized Dashboard Users)
create table if not exists public.admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews Table (Testimonials)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  content text not null,
  rating integer default 5,
  company text,
  avatar_url text,
  approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Posts Table (Blog)
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  category text,
  image_url text,
  read_time text,
  status text default 'published',
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------
-- 2. SCHEMA PATCHING (For Existing Databases)
-- ------------------------------------------
-- Ensures columns exist even if table was created in an older version

do $$
begin
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'details') then
    alter table public.projects add column details text;
  end if;
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'technologies') then
    alter table public.projects add column technologies text[] default '{}';
  end if;
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'date') then
    alter table public.projects add column date text;
  end if;
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'type') then
    alter table public.projects add column type text;
  end if;
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'client') then
    alter table public.projects add column client text;
  end if;
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'category') then
    alter table public.projects add column category text[] default '{}';
  else
    -- If it exists as text, convert it to text[]
    alter table public.projects alter column category type text[] using array[category];
  end if;
  
  if not exists (select from pg_attribute where attrelid = 'public.projects'::regclass and attname = 'status') then
    alter table public.projects add column status text default 'published';
  end if;

  if not exists (select from pg_attribute where attrelid = 'public.posts'::regclass and attname = 'status') then
    alter table public.posts add column status text default 'published';
  end if;
end $$;


-- ------------------------------------------
-- 3. SECURITY (RLS Policies)
-- ------------------------------------------

-- Enable RLS
alter table public.content enable row level security;
alter table public.projects enable row level security;
alter table public.settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;

-- Drop existing to avoid duplication
drop policy if exists "Public can view content" on public.content;
drop policy if exists "Public can view projects" on public.projects;
drop policy if exists "Public can view settings" on public.settings;
drop policy if exists "Public can view admin_users" on public.admin_users;
drop policy if exists "Public can view approved reviews" on public.reviews;
drop policy if exists "Public can submit reviews" on public.reviews;
drop policy if exists "Public can view posts" on public.posts;

drop policy if exists "Authenticated users can manage content" on public.content;
drop policy if exists "Authenticated users can manage projects" on public.projects;
drop policy if exists "Authenticated users can manage settings" on public.settings;
drop policy if exists "Authenticated users can insert admin_users" on public.admin_users;
drop policy if exists "Authenticated users can manage reviews" on public.reviews;
drop policy if exists "Authenticated users can manage posts" on public.posts;

-- Create Policies
create policy "Public can view content" on public.content for select using (true);
create policy "Public can view projects" on public.projects for select using (true);
create policy "Public can view settings" on public.settings for select using (true);
create policy "Public can view admin_users" on public.admin_users for select using (true);
create policy "Public can view approved reviews" on public.reviews for select using (approved = true);
create policy "Public can submit reviews" on public.reviews for insert with check (true);

create policy "Authenticated users can manage content" on public.content for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage settings" on public.settings for all using (auth.role() = 'authenticated');
create policy "Authenticated users can insert admin_users" on public.admin_users for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can manage reviews" on public.reviews for all using (auth.role() = 'authenticated');

create policy "Public can view posts" on public.posts for select using (true);
create policy "Authenticated users can manage posts" on public.posts for all using (auth.role() = 'authenticated');

-- Storage Bucket Logic
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'media') then
    insert into storage.buckets (id, name, public) values ('media', 'media', true);
  end if;
end $$;

-- Storage Policies
do $$
begin
  -- Drop existing storage policies if they exist
  drop policy if exists "Public access to media" on storage.objects;
  drop policy if exists "Authenticated users can manage media" on storage.objects;
  drop policy if exists "Public can upload avatars" on storage.objects;
exception
  when others then null;
end $$;

create policy "Public access to media" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated users can manage media" on storage.objects for all using (bucket_id = 'media' and auth.role() = 'authenticated');
create policy "Public can upload avatars" on storage.objects for insert with check (bucket_id = 'media');

-- ------------------------------------------
-- 4. DEFAULT CONTENT
-- ------------------------------------------

insert into public.content (key, value) values
  ('hero_title', 'Frontend Developer & UI Designer'),
  ('hero_description1', 'Building high-performance websites for businesses & brands.'),
  ('hero_description2', 'Crafting fast, scalable, and beautiful digital solutions that drive growth.'),
  ('services_header_title', 'Business Solutions.'),
  ('service1_title', 'Business Website Development'),
  ('service1_description', 'Custom-built, high-performance websites tailored to your business goals.'),
  ('service2_title', 'E-commerce Solutions'),
  ('service2_description', 'Seamless online shopping experiences with secure payment integration.'),
  ('service3_title', 'Personal Website Development'),
  ('service3_description', 'Custom-built websites tailored to your personal goals.'),
  ('service4_title', 'Digital Agency Services'),
  ('service4_description', 'End-to-end support from SEO strategy to web maintenance.'),
  ('skills_list', 'React.js, Tailwind CSS, Next.js, TypeScript, HTML, CSS, JavaScript, Responsive Design, Framer Motion, Shadcn UI'),
  ('experience_list', '[{"date": "2024", "role": "Freelance Developer", "company": "Self-Employed", "current": true}, {"date": "2026", "role": "Founder & CEO", "company": "Avera Tech Solutions", "current": true}]'),
  ('about_text1', 'I''m Knowledge Udoh, a Developer passionate about crafting digital experiences that resonate.')
on conflict (key) do update set value = excluded.value;

insert into public.settings (site_name, primary_color, social_links)
select 'CodeW/Knowledge', '#8B5CF6', 
  '{"github": "https://github.com/CODEWKNOWLEDGE", "resume_url": "/Knowledge_Udoh_Resume.pdf", "contact_email": "udohknowledge5@gmail.com"}'
where not exists (select 1 from public.settings);

-- Example Project
insert into public.projects (title, description, details, technologies, featured, category)
values ('FlowSpy Monitoring', 'Cloud visibility platform', 'Built for high-scale metrics.', '{"React", "Node.js"}', true, 'Web App')
on conflict do nothing;

NOTIFY pgrst, 'reload schema';
