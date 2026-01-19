# 🎨 גלריית ציורי ילדים - Full Stack

## 📦 הקבצים שקיבלת:

1. **מדריך_Full_Stack_Supabase.docx** - מדריך מפורט 40+ עמודים
2. **index.html** - דף ראשי (הגלריה)
3. **app.js** - לוגיקה + חיבור ל-Supabase
4. **admin.html** - מסך ניהול
5. **README.md** - הקובץ הזה

---

## ⚡ התחלה מהירה (10 דקות)

### 1️⃣ צור פרויקט ב-Supabase

1. כנס ל-https://supabase.com
2. התחבר עם Google
3. לחץ **New Project**
4. שם: `kids-gallery`
5. סיסמה: בחר סיסמה חזקה ושמור!
6. Region: **Southeast Asia (Singapore)**
7. לחץ **Create**

### 2️⃣ יצור טבלאות

1. לך ל-**SQL Editor** בתפריט השמאלי
2. העתק והדבק:

```sql
-- טבלת ילדים
CREATE TABLE kids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_before TEXT,
  image_after TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- טבלת הגדרות
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_garden TEXT,
  logo_personal TEXT
);

-- הכנסת שורה ראשונית
INSERT INTO settings (logo_garden, logo_personal) VALUES (null, null);

-- אפשר קריאה לכולם
ALTER TABLE kids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON kids FOR SELECT USING (true);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access" ON settings FOR SELECT USING (true);
```

3. לחץ **RUN** (פינה ימנית תחתונה)
4. בדוק ש-**Success!** מופיע

### 3️⃣ צור Storage Bucket

1. לך ל-**Storage** בתפריט
2. לחץ **Create a new bucket**
3. שם: `kids-media`
4. **Public bucket**: ✅ (חשוב!)
5. לחץ **Create bucket**

### 4️⃣ קבל את ה-API Keys

1. לך ל-**Settings** → **API**
2. העתק:
   - **Project URL** (למשל: `https://abc123.supabase.co`)
   - **anon public** key (מפתח ארוך)

### 5️⃣ הכנס את ה-Keys בקוד

פתח את `app.js` ו-`admin.html` והחלף:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';  // 👈 הדבק כאן
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // 👈 הדבק כאן
```

### 6️⃣ בדיקה לוקלית

1. פתח את `index.html` בדפדפן
2. אמור לראות מסך Splash (ללא ילדים)
3. פתח את `admin.html`
4. נסה להוסיף ילד ראשון

### 7️⃣ פריסה ל-Vercel

1. כנס ל-https://vercel.com
2. התחבר עם Google/GitHub
3. לחץ **Add New** → **Project**
4. גרור את התיקייה או העלה ZIP
5. לחץ **Deploy**
6. קבל URL!

---

## 🎯 מה הלאה?

- **הוסף ילדים** דרך admin.html
- **שתף את הלינק** עם ההורים
- **קרא את המדריך המלא** (מדריך_Full_Stack_Supabase.docx) לתוספות

---

## 🆘 נתקעת?

### שגיאה: "Failed to fetch"
👉 בדוק שה-API Keys נכונים ב-app.js וב-admin.html

### לא רואה תמונות
👉 בדוק ש-Bucket הוא **Public** ב-Storage

### "Row Level Security"
👉 הרץ שוב את ה-SQL של ה-Policies

---

## 📊 מבנה הפרויקט

```
kids-gallery/
├── index.html      # דף ראשי
├── app.js          # לוגיקה
├── admin.html      # ניהול
└── README.md       # הוראות
```

---

## 💡 טיפים

1. **חינמי עד 500MB** - מספיק ל-2000 תמונות!
2. **Real-time** - הסר הערה מהקוד ב-app.js לעדכונים חיים
3. **Auth** - אפשר להוסיף מערכת התחברות בעתיד

---

בהצלחה! 🚀

**סבא שמעון - חכמה של פעם, מצחיק ומלא ב-AI**
