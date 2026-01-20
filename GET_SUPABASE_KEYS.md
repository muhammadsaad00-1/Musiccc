# How to Fix the Supabase API Key Issue

## Problems Fixed:
✅ **Removed duplicate `/admin/singers` endpoint** (was defined twice)
✅ **Fixed storage path** (was `singers/singers/file.jpg`, now `file.jpg`)
✅ **Added trailing slash to Supabase URL**

## ⚠️ **CRITICAL: You Need the Correct API Key**

### Step 1: Get Your Supabase Keys
1. Go to: https://supabase.com/dashboard
2. Select your project: **ubskhylblogbuhzxhadk**
3. Click on **Settings** (gear icon on left sidebar)
4. Click on **API**
5. You'll see two important keys:

#### Option A: **anon / public key** (Recommended for Basic Use)
- Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Use this if you have Row Level Security (RLS) policies set up properly
- **Copy the entire key**

#### Option B: **service_role key** (For Full Access)
- Also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` but is longer
- Has **full access** to your database (bypasses RLS)
- ⚠️ **NEVER expose this in client-side code!**
- **Copy the entire key**

### Step 2: Update Your Code

Open `supabase_client.py` and replace this line:
```python
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY_HERE..."
```

With:
```python
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE..."
```

### Step 3: Configure Storage Bucket Permissions (If Using anon Key)

If you're using the **anon** key, you need to make your storage buckets public or configure RLS policies:

1. Go to **Storage** in Supabase Dashboard
2. Click on the **singers** bucket
3. Click **Policies** tab
4. Add a policy to allow uploads:
   - Policy Name: `Allow uploads`
   - Policy Definition: 
     ```sql
     true
     ```
   - Or for authenticated users only:
     ```sql
     auth.role() = 'authenticated'
     ```

Do the same for the **events** bucket.

### Step 4: Test the API

After updating the key, the server will auto-reload. Test with:
```bash
curl -X POST "http://localhost:8000/admin/singers?name=TestSinger&genre=Pop&experience_years=5&base_price=1000&location=NYC" \
  -F "image=@/tmp/test_singer.jpg"
```

## Error Reference:

- ❌ `signature verification failed` = Wrong/invalid API key
- ❌ `new row violates row-level security policy` = Correct key, but RLS blocking access
- ❌ `Unauthorized` = Using publishable key (not anon or service_role)
- ✅ `{"message": "Singer created"}` = SUCCESS!

---

**Current Status:** Waiting for you to add the correct Supabase API key to `supabase_client.py`
