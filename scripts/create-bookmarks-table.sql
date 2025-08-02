-- Enable the uuid-ossp extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the bookmarks table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id TEXT NOT NULL, -- Dev.to article ID (can be string or number)
  article_title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  article_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a unique constraint to prevent duplicate bookmarks for the same user and article
ALTER TABLE public.bookmarks
ADD CONSTRAINT unique_user_article UNIQUE (user_id, article_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Create a policy for users to view their own bookmarks
CREATE POLICY "Users can view their own bookmarks." ON public.bookmarks
FOR SELECT USING (auth.uid() = user_id);

-- Create a policy for users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks." ON public.bookmarks
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy for users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks." ON public.bookmarks
FOR DELETE USING (auth.uid() = user_id);
