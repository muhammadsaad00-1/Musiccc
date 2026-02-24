# API Performance Optimization Plan

## 📊 Current Performance Issue

**Problem**: Frontend API calls take 3-4 seconds to load, causing poor user experience with excessive loading indicators.

**Goal**: Reduce loading time from **3-4 seconds → 800ms-1.5 seconds**

---

## 🔍 Root Causes Identified

Through comprehensive codebase analysis, the following bottlenecks were identified:

### Critical Issues (1-2 seconds each)
1. **N+1 Query Problem** - Backend makes multiple sequential database queries instead of optimized joins
2. **Sequential Frontend Loading** - 7-8 API calls made one after another instead of parallel
3. **No Client-Side Caching** - Same data fetched repeatedly across pages

### High-Impact Issues (500ms-1s each)
4. **Fetching All Performers** - No pagination, entire dataset loaded unnecessarily
5. **Redundant API Calls** - Multiple components fetch same data independently
6. **Inefficient Cache Strategy** - Too short TTL (5 min), overly aggressive invalidation

### Medium-Impact Issues (200-500ms)
7. **Missing Database Indexes** - Slow queries on unindexed JSONB and text fields
8. **Inefficient Database Queries** - Using `SELECT *`, no field selection

---

## 🎯 TODO List (Prioritized)

### ✅ Phase 1: Critical Fixes (Target: 2-3 days)

#### 1.1 Fix N+1 Query Problem in Categories Endpoint
**File**: `backend/main.py` (Lines 1030-1053)

**Current Problem**:
```python
for category in categories:
    count_response = supabase.table("performers").select("id", count="exact").contains("category", [category["name"]]).execute()
    category["artist_count"] = count_response.count
```
- Makes 1 query for categories + N queries for counts (11 queries for 10 categories)

**Solution**:
- Use PostgreSQL aggregation with a single query
- Leverage Supabase RPC function or raw SQL
- Alternative: Use window functions or CTEs

**Expected Impact**: Reduce categories endpoint from ~1-2s to ~100-200ms

---

#### 1.2 Fix N+1 Query Problem in Events Endpoint
**File**: `backend/main.py` (Lines 819-844)

**Current Problem**:
```python
for event in events_response.data:
    event_performers_response = supabase.table("event_performers").select("performers(*)").eq("event_id", event["id"]).execute()
```
- Loops through events making separate performer queries

**Solution**:
- Use Supabase's relationship syntax to eager load in single query
- Example: `.select("*, event_performers(performers(*))")`
- Fetch all junction table data in one query, then group in Python

**Expected Impact**: Reduce events endpoint from ~500ms-1s to ~100-200ms

---

#### 1.3 Fix N+1 Query Problem in Packages Endpoint
**File**: `backend/main.py` (Lines 1463-1498)

**Current Problem**:
```python
for package in packages_response.data:
    package_performers_response = supabase.table("package_performers").select("performers(*)").eq("package_id", package["id"]).execute()
```
- Same N+1 pattern as events

**Solution**:
- Same approach as events endpoint
- Use eager loading: `.select("*, package_performers(performers(*))")`

**Expected Impact**: Reduce packages endpoint from ~500ms-1s to ~100-200ms

---

#### 1.4 Implement Parallel Frontend Data Fetching
**File**: `frontend/src/app/page.tsx` (Homepage)

**Current Problem**:
- 7-8 API calls made sequentially by different components:
  - Hero.tsx → `/api/hero-images` + `/api/stats`
  - CategoryGrid.tsx → `/categories`
  - FeaturedArtists.tsx → `/performers`
  - ReviewsCarousel.tsx → `/api/reviews`
  - ArtistReviewsCarousel.tsx → `/api/artist-testimonials`
  - OurClients.tsx → `/api/client-logos`

**Solution Options**:

**Option A: Server-Side Parallel Fetching (Recommended)**
```typescript
// In page.tsx (Server Component)
export default async function HomePage() {
  const [heroImages, stats, categories, performers, reviews, testimonials, clients] = 
    await Promise.all([
      fetch('/api/hero-images'),
      fetch('/api/stats'),
      fetch('/categories'),
      fetch('/performers?featured=true'),
      fetch('/api/reviews?limit=20'),
      fetch('/api/artist-testimonials'),
      fetch('/api/client-logos')
    ]);
  
  // Pass data as props to client components
}
```

**Option B: Create Aggregation Endpoint**
```python
# New endpoint: /api/homepage-data
@app.get("/api/homepage-data")
async def get_homepage_data():
    # Fetch all data in parallel on backend
    # Return single payload
    return {
        "heroImages": ...,
        "stats": ...,
        "categories": ...,
        "featuredPerformers": ...,
        "reviews": ...,
        "testimonials": ...,
        "clientLogos": ...
    }
```

**Expected Impact**: Reduce homepage load from ~3-4s to ~1-1.5s

---

#### 1.5 Implement Client-Side Caching with React Query
**Files**: 
- `frontend/package.json` (add dependency)
- `frontend/src/app/layout.tsx` (add provider)
- All API-calling components

**Solution**:
1. Install React Query: `npm install @tanstack/react-query`
2. Wrap app in QueryClientProvider
3. Replace `fetch` calls with `useQuery` hooks
4. Configure stale time and cache time appropriately

**Example Implementation**:
```typescript
// In layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// In components
const { data: categories } = useQuery({
  queryKey: ['categories'],
  queryFn: () => fetch('/api/categories').then(r => r.json())
});
```

**Benefits**:
- Automatic deduplication (Header, Footer, SearchBar share cache)
- Background refetching
- Request deduplication
- Optimistic updates

**Expected Impact**: Eliminate duplicate API calls, reduce redundant fetches by 50-70%

---

### ✅ Phase 2: High-Impact Optimizations (Target: 2-3 days)

#### 2.1 Add Pagination to Performers Endpoint
**File**: `backend/main.py` (Lines 538-558)

**Current Problem**:
```python
query = supabase.table("performers").select("*")
response = query.execute()  # Returns ALL performers
```
- Search page, Compare page, Artists page all fetch entire dataset

**Solution**:
```python
@app.get("/performers")
async def get_performers(
    page: int = 1,
    limit: int = 20,
    category: str = None,
    search: str = None
):
    offset = (page - 1) * limit
    query = supabase.table("performers").select("*", count="exact")
    
    if category:
        query = query.contains("category", [category])
    if search:
        query = query.ilike("name", f"%{search}%")
    
    query = query.range(offset, offset + limit - 1)
    response = query.execute()
    
    return {
        "data": response.data,
        "total": response.count,
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(response.count / limit)
    }
```

**Frontend Updates Needed**:
- `frontend/src/app/search/page.tsx` (Lines 51-60)
- `frontend/src/app/compare/page.tsx` (Lines 53-70)
- `frontend/src/app/artists/page.tsx` (Lines 82-86)

**Expected Impact**: Reduce payload size by 80-90%, decrease load time by 500ms-1s

---

#### 2.2 Implement Smarter Field Selection
**Files**: `backend/main.py` (multiple endpoints)

**Current Problem**:
- All endpoints use `SELECT "*"`
- List views get full performer objects with bios, descriptions, etc.

**Solution**:
```python
# For list views - minimal fields
@app.get("/performers/list")
async def get_performers_list():
    query = supabase.table("performers").select(
        "id, name, slug, image_url, category, base_price, rating"
    )
    # ...

# For detail views - all fields
@app.get("/performers/{slug}")
async def get_performer_detail(slug: str):
    query = supabase.table("performers").select("*")
    # ...
```

**Apply to**:
- Categories endpoint (only need: id, name, slug, image_url)
- Events endpoint (select specific fields)
- Packages endpoint (select specific fields)
- Reviews endpoint (exclude unnecessary user data)

**Expected Impact**: Reduce payload size by 30-50%, save 200-400ms

---

#### 2.3 Optimize Backend Cache Strategy
**File**: `backend/main.py` (Lines 24-48)

**Current Problems**:
- TTL too short (5 minutes)
- Entire cache invalidated on any change
- Some endpoints not cached (`/api/reviews`, `/api/stats`)

**Solutions**:

**A. Increase TTL for Static-ish Data**:
```python
# Different TTLs for different data types
performers_cache = TTLCache(maxsize=500, ttl=1800)  # 30 minutes
categories_cache = TTLCache(maxsize=100, ttl=3600)  # 1 hour
reviews_cache = TTLCache(maxsize=200, ttl=900)      # 15 minutes
stats_cache = TTLCache(maxsize=10, ttl=300)         # 5 minutes
```

**B. Fine-Grained Cache Invalidation**:
```python
def invalidate_performer_cache(performer_id: str):
    # Only invalidate specific performer, not entire cache
    cache_key = f"performer:{performer_id}"
    if cache_key in cache:
        del cache[cache_key]
    # Invalidate list caches that might include this performer
    invalidate_pattern("performers:*")
```

**C. Add Cache Warming**:
```python
@app.on_event("startup")
async def warmup_cache():
    # Pre-populate frequently accessed data
    await get_categories()
    await get_performers(featured=True)
    await get_stats()
```

**D. Cache Previously Uncached Endpoints**:
- Add caching to `/api/reviews`
- Add caching to `/api/stats`
- Add caching to `/blogs`

**Expected Impact**: Reduce cache misses by 40-60%, save 200-500ms on cached requests

---

#### 2.4 Reduce Redundant API Calls
**Files**: Multiple components fetching `/categories`

**Current Problem**:
- Header.tsx (Line 62)
- Footer.tsx (Line 59)
- SearchBar.tsx (Line 26)
- CategoryGrid.tsx (Line 56)
- Category pages
- Search page
- Compare page

**Solution**:

**Option A: With React Query (from Phase 1.5)**
- React Query automatically deduplicates requests
- All components share same cache
- No code changes needed if Phase 1.5 implemented

**Option B: Lift State to Layout**
```typescript
// In layout.tsx
const categories = await fetch('/api/categories');

// Pass to children via context or props
<CategoriesContext.Provider value={categories}>
  {children}
</CategoriesContext.Provider>
```

**Expected Impact**: Eliminate 5-10 duplicate requests per page navigation

---

### ✅ Phase 3: Database & Query Optimizations (Target: 1-2 days)

#### 3.1 Add Database Indexes
**Files**: Create new migration files or execute SQL directly in Supabase

**Indexes to Add**:

```sql
-- GIN index for JSONB array category field
CREATE INDEX idx_performers_category ON performers USING GIN (category);

-- B-tree index for name search
CREATE INDEX idx_performers_name ON performers (name);

-- Index for event type filtering
CREATE INDEX idx_events_event_type ON events (event_type);
CREATE INDEX idx_packages_event_type ON packages (event_type);

-- Indexes on junction table foreign keys (if not auto-created)
CREATE INDEX idx_event_performers_event_id ON event_performers (event_id);
CREATE INDEX idx_event_performers_performer_id ON event_performers (performer_id);
CREATE INDEX idx_package_performers_package_id ON package_performers (package_id);
CREATE INDEX idx_package_performers_performer_id ON package_performers (performer_id);

-- Composite index for common query patterns
CREATE INDEX idx_performers_category_active ON performers (category, is_active);

-- Index for sorting/filtering
CREATE INDEX idx_performers_rating ON performers (rating DESC);
CREATE INDEX idx_performers_base_price ON performers (base_price);
```

**How to Verify Impact**:
```sql
EXPLAIN ANALYZE SELECT * FROM performers WHERE category @> '["Singer"]';
```

**Expected Impact**: Speed up filtered queries by 3-10x, save 200-500ms on complex queries

---

#### 3.2 Optimize JSONB Category Queries
**File**: `backend/main.py` (Line 545)

**Current Problem**:
```python
query = query.contains("category", [category])
```
- JSONB `.contains()` can be slow even with GIN index

**Solution Options**:

**Option A: Use Proper JSONB Operator**
```python
# Use @> operator with RPC
query = query.rpc('has_category', {'cat': category})
```

```sql
-- Create RPC function in Supabase
CREATE FUNCTION has_category(cat text) RETURNS SETOF performers AS $$
  SELECT * FROM performers WHERE category @> ARRAY[cat]::jsonb;
$$ LANGUAGE sql;
```

**Option B: Denormalize to Many-to-Many Table**
- Create `performer_categories` junction table
- Better query performance with proper joins
- Easier to index and query

**Expected Impact**: Improve category filtering by 50-70%

---

### ✅ Phase 4: Quick Wins (Target: 1 day)

#### 4.1 Add Loading Skeletons Instead of Spinners
**Files**: All page components

**Current Problem**: Blank screens with spinners feel slower than they are

**Solution**:
- Create skeleton components matching actual layout
- Show content placeholders while loading
- Improves **perceived** performance significantly

**Expected Impact**: Better UX, feels 30-40% faster even with same load time

---

#### 4.2 Implement Lazy Loading for Below-Fold Components
**Files**: Homepage components

**Current Problem**: Loading all components immediately, even below fold

**Solution**:
```typescript
import dynamic from 'next/dynamic';

const ReviewsCarousel = dynamic(() => import('./ReviewsCarousel'), {
  loading: () => <ReviewsSkeleton />
});

const OurClients = dynamic(() => import('./OurClients'), {
  loading: () => <ClientsSkeleton />
});
```

**Expected Impact**: Reduce initial bundle size, prioritize above-fold content

---

#### 4.3 Enable Response Compression
**File**: `backend/main.py`

**Current State**: No compression middleware visible

**Solution**:
```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
```

**Expected Impact**: Reduce payload size by 60-80%, save 100-300ms on large responses

---

## 📈 Expected Performance Improvements

| Phase | Optimization | Current Time | After Fix | Time Saved |
|-------|-------------|--------------|-----------|------------|
| 1 | Fix N+1 Queries | 1.5-2s | 300-400ms | **1.2-1.6s** |
| 1 | Parallel Frontend Loading | 1-2s | 400-600ms | **600ms-1.4s** |
| 1 | Client-Side Caching | 500ms-1s | 100-200ms | **400ms-800ms** |
| 2 | Add Pagination | 500ms-1s | 100-200ms | **400ms-800ms** |
| 2 | Optimize Cache Strategy | 200-500ms | 50-100ms | **150ms-400ms** |
| 3 | Database Indexes | 200-500ms | 50-100ms | **150ms-400ms** |
| 2 | Field Selection | 100-200ms | 50-100ms | **50ms-100ms** |

**Total Estimated Improvement**: **3-4 seconds → 800ms-1.5 seconds**

---

## 🔧 Implementation Priority

### Must Fix (Critical - Do First)
1. ✅ Phase 1.1-1.3: Fix all N+1 queries
2. ✅ Phase 1.4: Implement parallel frontend loading
3. ✅ Phase 1.5: Add React Query for caching

### Should Fix (High Impact)
4. ✅ Phase 2.1: Add pagination
5. ✅ Phase 2.3: Optimize cache strategy
6. ✅ Phase 3.1: Add database indexes

### Nice to Have (Quick Wins)
7. ✅ Phase 2.2: Field selection
8. ✅ Phase 4.1: Loading skeletons
9. ✅ Phase 4.3: Response compression

---

## 📝 Testing & Validation

After each phase, validate improvements:

### Backend Performance Testing
```python
# Add timing middleware
import time

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"{request.url.path}: {process_time:.3f}s")
    return response
```

### Frontend Performance Monitoring
```typescript
// In browser console
performance.getEntriesByType('navigation')[0].loadEventEnd
```

### Tools to Use
- Chrome DevTools Network tab (waterfall view)
- Lighthouse performance audit
- React Developer Tools Profiler
- Supabase dashboard query logs

---

## 🚀 Getting Started

1. **Start with Phase 1** (Critical Fixes) - biggest impact
2. **Test after each change** - don't batch all changes together
3. **Monitor before/after metrics** - document improvements
4. **Adjust based on results** - some optimizations may have less impact than expected

---

## 📚 Additional Resources

### React Query Documentation
- https://tanstack.com/query/latest/docs/react/overview

### Supabase Performance Guide
- https://supabase.com/docs/guides/database/performance

### PostgreSQL Indexing
- https://www.postgresql.org/docs/current/indexes.html

### Next.js Performance
- https://nextjs.org/docs/app/building-your-application/optimizing

---

## ✅ Success Criteria

- [ ] Homepage loads in < 1.5 seconds
- [ ] Category page loads in < 1 second
- [ ] Search results appear in < 800ms
- [ ] No duplicate API calls visible in Network tab
- [ ] Loading skeletons shown instead of blank screens
- [ ] Backend endpoints respond in < 300ms (cached) or < 500ms (uncached)

---

**Document Version**: 1.0  
**Last Updated**: February 24, 2026  
**Status**: Ready for Implementation
