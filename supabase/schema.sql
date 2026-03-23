-- Campus Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  department TEXT,
  avatar_url TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Schedules
CREATE TABLE schedules (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, item_id TEXT NOT NULL, item_data JSONB NOT NULL, date DATE, memo TEXT, alert_days INT DEFAULT 7, dept TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own schedules" ON schedules FOR ALL USING (auth.uid() = user_id);

-- Expenses
CREATE TABLE expenses (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, amount INT NOT NULL, category TEXT NOT NULL, date DATE, memo TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);

-- Budgets
CREATE TABLE budgets (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, category TEXT NOT NULL, amount INT DEFAULT 0, month TEXT NOT NULL, UNIQUE(user_id, category, month));
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- Grades
CREATE TABLE grades (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, subject TEXT NOT NULL, grade NUMERIC(2,1), credits INT NOT NULL, semester TEXT NOT NULL, type TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own grades" ON grades FOR ALL USING (auth.uid() = user_id);

-- Roadmap Progress
CREATE TABLE roadmap_progress (user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, item_id TEXT NOT NULL, completed BOOLEAN DEFAULT TRUE, PRIMARY KEY(user_id, item_id));
ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own roadmap" ON roadmap_progress FOR ALL USING (auth.uid() = user_id);

-- Reviews
CREATE TABLE reviews (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, title TEXT NOT NULL, org TEXT, result TEXT, date DATE, category TEXT, body TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users CRUD own reviews" ON reviews FOR ALL USING (auth.uid() = user_id);

-- Posts
CREATE TABLE posts (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, category TEXT NOT NULL, tags TEXT[] DEFAULT '{}', like_count INT DEFAULT 0, comment_count INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE TABLE comments (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, body TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes
CREATE TABLE likes (post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, PRIMARY KEY(post_id, user_id));
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Users toggle own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE notifications (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, type TEXT NOT NULL, message TEXT NOT NULL, data JSONB, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Counter triggers
CREATE OR REPLACE FUNCTION update_post_like_count() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id; ELSIF TG_OP = 'DELETE' THEN UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id; END IF; RETURN NULL; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_like_change AFTER INSERT OR DELETE ON likes FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE OR REPLACE FUNCTION update_post_comment_count() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'INSERT' THEN UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id; ELSIF TG_OP = 'DELETE' THEN UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id; END IF; RETURN NULL; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_comment_change AFTER INSERT OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
