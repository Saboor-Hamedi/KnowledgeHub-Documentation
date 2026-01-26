-- =========================================
-- Dev Snippet – Clean Supabase Schema
-- =========================================

-- 1. Enable UUID generation
create extension if not exists "pgcrypto";

-- =========================================
-- 2. PROFILES
-- one-to-one with auth.users
-- =========================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamptz default now()
);
create policy "Users can insert their own profile"
on profiles
for insert
with check (auth.uid() = id);

-- 1. Allow anyone to read profiles (needed for the username in posts)
drop policy "Users read own profile" on profiles;
create policy "Profiles are public"
on profiles for select
using (true);

-- 2. Allow anyone to read posts (needed for documentation/updates)
drop policy "Users read own posts" on posts;
create policy "Posts are public"
on posts for select
using (true);

-- 3. Allow anyone to read tags
-- (This was already true in your original file, but good to double check)

alter table profiles enable row level security;

create policy "Users read own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users update own profile"
on profiles for update
using (auth.uid() = id);

-- =========================================
-- 3. POSTS (SNIPPETS)
-- owned by users via profiles
-- =========================================
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  content text not null,
  language text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index posts_user_id_idx on posts(user_id);
create index posts_language_idx on posts(language);

alter table posts enable row level security;

create policy "Users read own posts"
on posts for select
using (auth.uid() = user_id);

create policy "Users insert own posts"
on posts for insert
with check (auth.uid() = user_id);

create policy "Users update own posts"
on posts for update
using (auth.uid() = user_id);

create policy "Users delete own posts"
on posts for delete
using (auth.uid() = user_id);

-- =========================================
-- 4. AUTO UPDATE updated_at
-- =========================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
before update on posts
for each row
execute function set_updated_at();

-- =========================================
-- 5. TAGS
-- global reusable tags
-- =========================================
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

alter table tags enable row level security;

create policy "Anyone can read tags"
on tags for select
using (true);

-- =========================================
-- 6. POST_TAGS (many-to-many)
-- =========================================
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

alter table post_tags enable row level security;

create policy "Users manage tags for own posts"
on post_tags
using (
  exists (
    select 1
    from posts
    where posts.id = post_tags.post_id
      and posts.user_id = auth.uid()
  )
);

-- =========================================
-- ✅ DONE
-- =========================================
