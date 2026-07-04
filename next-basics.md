# 📚 Next.js 14 - Core Concepts Guide

## 🚀 Getting Started

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

---

## 1. 🎨 React Server Components (RSC)

**Server Components** render on the server, reducing client-side JavaScript.

### Implementation
```jsx
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData(); // Runs on server
  return <div>{data}</div>;
}
```

### Client Components
```jsx
// ✅ Client Component (use 'use client' directive)
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## 2. 📦 Separate Client Components

**Instead of making entire page a client component, isolate interactive parts.**

### ❌ Bad Practice
```jsx
'use client'; // Whole page becomes client component
export default function Page() {
  return (
    <div>
      <h1>Static Content</h1>
      <InteractiveButton /> {/* Only this needs client */}
    </div>
  );
}
```

### ✅ Good Practice
```jsx
// page.jsx (Server Component)
import InteractiveButton from './InteractiveButton';

export default function Page() {
  return (
    <div>
      <h1>Static Content (Server Rendered)</h1>
      <InteractiveButton /> {/* Only this is client */}
    </div>
  );
}

// InteractiveButton.jsx (Client Component)
'use client';
export default function InteractiveButton() {
  return <button onClick={() => alert('Clicked!')}>Click Me</button>;
}
```

---

## 3. 🖼️ Image Optimization

**Next.js Image component automatically optimizes images.**

### Implementation
```jsx
import Image from 'next/image';

export default function Page() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={400}
      height={400}
      priority // Optional: preload important images
      // Automatically adds: lazy loading, responsive, WebP conversion
    />
  );
}
```

### Benefits
- ✅ Automatic lazy loading
- ✅ Responsive images (srcset)
- ✅ WebP/AVIF conversion
- ✅ No layout shift (width/height required)
- ✅ Built-in blur placeholder

---

## 4. 🔤 Font Optimization

**Next.js has built-in Google Font optimization.**

### Implementation
```jsx
// app/layout.jsx
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
});

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Benefits
- ✅ Self-hosted fonts (no external requests)
- ✅ Automatic font optimization
- ✅ Prevents layout shift
- ✅ Variable fonts support

---

## 5. 🧭 Dynamic Routing

**Create pages with dynamic parameters.**

### File Structure
```
app/
  blog/
    [id]/           # Dynamic route
      page.jsx
    layout.jsx
```

### Implementation
```jsx
// app/blog/[id]/page.jsx
export default async function BlogPost({ params }) {
  const { id } = params;
  const post = await getPost(id);
  
  // ✅ Handle non-existent posts
  if (!post) {
    return (
      <div>
        <h1>404 - Post Not Found</h1>
        <p>The post with ID {id} doesn't exist.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
```

### Catch-All Routes
```jsx
// app/docs/[...slug]/page.jsx
export default function DocsPage({ params }) {
  const { slug } = params; // slug = ['api', 'v1', 'users']
  return <div>Docs: {slug.join('/')}</div>;
}
```

---

## 6. ⚡ Prefetch

**Next.js automatically prefetches linked pages.**

### Implementation
```jsx
import Link from 'next/link';

// ✅ Automatic prefetch (visible in viewport)
<Link href="/dashboard">Dashboard</Link>

// ❌ Disable prefetch (e.g., heavy pages)
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>

// ✅ Programmatic prefetch
import { useRouter } from 'next/navigation';

function Component() {
  const router = useRouter();
  
  useEffect(() => {
    router.prefetch('/dashboard');
  }, []);
}
```

### How It Works
- ✅ Prefetches in background when link is visible
- ✅ Only fetches page data (not the full page)
- ✅ Reduces navigation time significantly
- ✅ Works with `next/link` automatically

---

## 7. 📝 Metadata

**Manage SEO and page metadata.**

### Static Metadata
```jsx
// app/page.jsx
export const metadata = {
  title: 'My App',
  description: 'Welcome to my app',
  keywords: ['nextjs', 'react'],
  openGraph: {
    title: 'My App',
    description: 'Learn Next.js',
    images: ['/og-image.jpg'],
  },
};
```

### Dynamic Metadata
```jsx
// app/blog/[id]/page.jsx
export async function generateMetadata({ params }) {
  const { id } = params;
  const post = await getPost(id);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

// ✅ Alternative: Dynamic metadata with async
export async function generateMetadata({ params }) {
  return {
    title: {
      absolute: 'Home',
      template: '%s | My App', // Adds suffix to child pages
    },
  };
}
```

---

## 8. 📊 Data Fetching

### ❌ Old Way (Client-side)
```jsx
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data}</div>;
}
```

### ✅ New Way (Server-side)
```jsx
// app/page.jsx (Server Component)
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  
  return <div>{json.title}</div>;
}
```

---

## 9. ⏳ Loading States

**Use `loading.js` for automatic loading UI.**

### Implementation
```jsx
// app/loading.jsx (Global loading)
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
        Loading...
      </div>
    </div>
  );
}
```

### Testing Loading States
```bash
# DevTools → Network Tab → Throttle
# Select: Slow 3G
# Check: ☑️ Disable Cache
```

### Streaming with Suspense
```jsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Content</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

---

## 10. Sequential vs Parallel Data Fetching

### ❌ Sequential (Slow)
```jsx
const user = await getUser(id);        // Wait for this
const posts = await getUserPosts(id);  // Then do this
const comments = await getComments(id); // Then this
// Total: 3 seconds (if each takes 1s)
```

### ✅ Parallel (Fast)
```jsx
// ✅ Parallel with Promise.all
const [user, posts, comments] = await Promise.all([
  getUser(id),        // Starts immediately
  getUserPosts(id),   // Starts immediately  
  getComments(id)     // Starts immediately
]);
// Total: 1 second (all run simultaneously)
```

### Streaming Pattern
```jsx
// ✅ Parallel with streaming (best UX)
const userPromise = getUser(id);
const postsPromise = getUserPosts(id);

const user = await userPromise; // Blocks critical content

return (
  <div>
    <UserProfile user={user} /> {/* Renders immediately */}
    <Suspense fallback={<PostsLoading />}>
      <UserPosts promise={postsPromise} /> {/* Streams in */}
    </Suspense>
  </div>
);
```

---

## 11. SSR vs SSG vs ISR

### Server-Side Rendering (SSR)
```jsx
// ✅ Dynamic, fresh data on every request
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store' // Disable cache
  });
  return <div>{data}</div>;
}
```

### Static Site Generation (SSG)
```jsx
// ✅ Build-time rendering (default)
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // Default behavior
  });
  return <div>{data}</div>;
}
```

### Incremental Static Regeneration (ISR)
```jsx
// ✅ Static with periodic revalidation
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { 
      revalidate: 60 // Regenerate every 60 seconds
    }
  });
  return <div>{data}</div>;
}
```

---

## 12. 📄 generateStaticParams

**Pre-generate dynamic routes at build time.**

### Implementation
```jsx
// app/blog/[id]/page.jsx
export async function generateStaticParams() {
  // Fetch all posts
  const posts = await getAllPosts();
  
  // Generate paths for each post
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

// ✅ With limit (for large datasets)
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  // Only pre-render recent posts
  return posts
    .slice(0, 10)
    .map((post) => ({
      id: post.id.toString(),
    }));
}

// ✅ With additional params
export async function generateStaticParams() {
  return [
    { id: '1', category: 'tech' },
    { id: '2', category: 'design' },
  ];
}
```

---

## 📊 Cache Control Summary

| Strategy | Method | When to Use |
|----------|--------|-------------|
| **SSR** | `cache: 'no-store'` | Real-time data, user-specific |
| **SSG** | `cache: 'force-cache'` | Static content, blog posts |
| **ISR** | `next: { revalidate: 60 }` | Semi-dynamic, product pages |

---

## 🎯 Quick Reference

```jsx
// ✅ Server Component (Default)
export default async function Page() {
  return <div>Server</div>;
}

// ✅ Client Component
'use client';
export default function ClientComponent() {}

// ✅ Dynamic Route
// app/blog/[id]/page.jsx
export default function Page({ params }) {
  return <div>ID: {params.id}</div>;
}

// ✅ Static Generation
export async function generateStaticParams() {
  return [{ id: '1' }];
}

// ✅ Dynamic Metadata
export async function generateMetadata({ params }) {
  return { title: 'Dynamic Title' };
}

// ✅ Loading UI
// app/loading.jsx
export default function Loading() {
  return <div>Loading...</div>;
}

// ✅ Error UI
// app/error.jsx
'use client';
export default function Error({ error, reset }) {
  return <button onClick={reset}>Retry</button>;
}
```

---

## 🚀 Performance Checklist

- [ ] Use Image component for images
- [ ] Use Next.js fonts (no external requests)
- [ ] Move interactive parts to client components
- [ ] Use parallel data fetching
- [ ] Implement Suspense for streaming
- [ ] Add loading states
- [ ] Use generateStaticParams for static routes
- [ ] Set appropriate cache strategies
- [ ] Prefetch important routes
- [ ] Handle 404/error states gracefully

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)