---
date: 2025-01-02T10:00:00+05:30
description: Master all web rendering strategies including CSR, SSR, SSG, ISR, hydration, streaming SSR, and React Server Components with practical examples and trade-offs.
premium: true
---

# 🎯 Web Rendering Strategies: Complete Guide to CSR, SSR, SSG, ISR & Hydration

> **Interview Importance:** 🔴 Critical — Understanding rendering strategies is essential for modern frontend development and a common topic in senior-level interviews.

This comprehensive guide covers all major web rendering strategies, their trade-offs, and when to use each approach. We'll explore both general concepts and React-specific implementations.

---

## 1️⃣ The Rendering Landscape Overview

Before diving deep, let's understand the rendering spectrum:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WEB RENDERING STRATEGIES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BUILD TIME              REQUEST TIME              CLIENT RUNTIME           │
│  ──────────              ────────────              ──────────────           │
│      │                        │                         │                   │
│      ▼                        ▼                         ▼                   │
│  ┌───────┐              ┌───────────┐              ┌─────────┐             │
│  │  SSG  │              │    SSR    │              │   CSR   │             │
│  │Static │              │  Server   │              │ Client  │             │
│  │ Gen   │              │  Render   │              │ Render  │             │
│  └───────┘              └───────────┘              └─────────┘             │
│      │                        │                         │                   │
│      │     ┌──────────────────┼──────────────────┐      │                   │
│      │     │                  │                  │      │                   │
│      ▼     ▼                  ▼                  ▼      ▼                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐                 │
│  │     ISR     │      │  Streaming  │      │  Hydration  │                 │
│  │ Incremental │      │    SSR      │      │  (Client)   │                 │
│  │   Static    │      │             │      │             │                 │
│  │   Regen     │      │             │      │             │                 │
│  └─────────────┘      └─────────────┘      └─────────────┘                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    REACT SERVER COMPONENTS (RSC)                    │   │
│  │              Hybrid: Server renders components, client hydrates     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Quick Comparison Table

| Strategy | HTML Generation | Initial Load | SEO | Data Freshness | Interactivity |
|----------|-----------------|--------------|-----|----------------|---------------|
| **CSR** | Client | Slow | Poor | Fresh | Immediate after JS loads |
| **SSR** | Server (per request) | Fast | Excellent | Fresh | After hydration |
| **SSG** | Build time | Fastest | Excellent | Stale (until rebuild) | After hydration |
| **ISR** | Build + Background | Fast | Excellent | Configurable | After hydration |
| **Streaming SSR** | Server (chunked) | Progressive | Excellent | Fresh | Progressive |
| **RSC** | Server (hybrid) | Fast | Excellent | Fresh | Selective hydration |

---

## 2️⃣ Client-Side Rendering (CSR)

### What is CSR?

Client-Side Rendering means the browser downloads a minimal HTML shell, then JavaScript runs to generate and render the actual content.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CSR RENDERING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser          Server            JavaScript                  │
│     │                │                   │                      │
│     │───GET /───────▶│                   │                      │
│     │                │                   │                      │
│     │◀──Empty HTML───│                   │                      │
│     │   (shell)      │                   │                      │
│     │                                    │                      │
│     │───Download JS bundles─────────────▶│                      │
│     │                                    │                      │
│     │◀───────────────JS loaded───────────│                      │
│     │                                    │                      │
│     │         ┌──────────────────────────┤                      │
│     │         │ JS executes:             │                      │
│     │         │ 1. Creates DOM           │                      │
│     │         │ 2. Fetches data (API)    │                      │
│     │         │ 3. Renders UI            │                      │
│     │         └──────────────────────────┤                      │
│     │                                    │                      │
│     │◀──────Page visible + interactive──│                      │
│     │                                                           │
│                                                                 │
│  Timeline:                                                      │
│  ├──────────┼─────────────┼────────────────┤                    │
│  0         HTML          JS loaded        Content visible       │
│            received      & executed       & interactive         │
│                                                                 │
│  User sees: [BLANK PAGE] ────────────────▶ [FULL PAGE]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### CSR Implementation

#### Basic HTML Shell

```html
<!DOCTYPE html>
<html>
<head>
  <title>CSR App</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <!-- Empty shell - content generated by JavaScript -->
  <div id="root"></div>

  <!-- JavaScript bundle generates all content -->
  <script src="/bundle.js"></script>
</body>
</html>
```

#### React CSR Example

```javascript
// index.js - Entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// All rendering happens on client
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```javascript
// App.jsx - Fetches data on client
import { useState, useEffect } from 'react';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Data fetching happens after component mounts (client-side)
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://api.example.com/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <main>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </main>
  );
};

export default App;
```

### CSR: Pros & Cons

| Pros | Cons |
|------|------|
| ✅ Simple deployment (static files) | ❌ Poor SEO (empty initial HTML) |
| ✅ Rich interactivity | ❌ Slow initial page load |
| ✅ Reduced server load | ❌ Requires JavaScript to see content |
| ✅ Great for authenticated apps | ❌ Higher Time to First Contentful Paint |
| ✅ Easy caching | ❌ Poor performance on slow devices |

### When to Use CSR

- **Dashboards & admin panels** (behind authentication, SEO not needed)
- **Web applications** (email clients, project management tools)
- **Highly interactive UIs** (design tools, games)
- **Apps where content is user-specific** (social media feeds)

---

## 3️⃣ Server-Side Rendering (SSR)

### What is SSR?

Server-Side Rendering generates the full HTML on the server for **each request**. The browser receives a complete HTML page that's immediately visible.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SSR RENDERING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browser          Server                  Database              │
│     │                │                        │                 │
│     │───GET /posts───▶│                        │                 │
│     │                │                        │                 │
│     │                │───Fetch data──────────▶│                 │
│     │                │                        │                 │
│     │                │◀──────Data─────────────│                 │
│     │                │                        │                 │
│     │                ├────────────────────────┤                 │
│     │                │ Server renders HTML:   │                 │
│     │                │ 1. Execute components  │                 │
│     │                │ 2. Generate HTML       │                 │
│     │                │ 3. Include data        │                 │
│     │                └────────────────────────┤                 │
│     │                │                        │                 │
│     │◀──Full HTML────│                        │                 │
│     │   (visible)    │                        │                 │
│     │                                                           │
│     │  User sees content immediately!                           │
│     │                                                           │
│     │───Download JS (background)────────────▶│                  │
│     │                                                           │
│     │◀──────JS hydrates (makes interactive)──│                  │
│     │                                                           │
│                                                                 │
│  Timeline:                                                      │
│  ├──────────┼───────────────┼────────────────┤                  │
│  0         HTML            Content           Fully              │
│            received        visible!          interactive        │
│                                                                 │
│  User sees: [FULL CONTENT] ─────────────────▶ [INTERACTIVE]    │
│             (not interactive yet)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SSR Implementation

#### Express.js + React SSR

```javascript
// server.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const app = express();

app.get('*', async (req, res) => {
  // 1. Fetch data on server
  const data = await fetchDataFromDatabase();

  // 2. Render React component to HTML string
  const html = renderToString(<App initialData={data} />);

  // 3. Send complete HTML with embedded data
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR App</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div id="root">${html}</div>

        <!-- Embed data for hydration -->
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(data)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

```javascript
// client.js - Hydration
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Get data that was embedded during SSR
const initialData = window.__INITIAL_DATA__;

// Hydrate (attach event listeners) instead of full render
hydrateRoot(
  document.getElementById('root'),
  <App initialData={initialData} />
);
```

### Next.js SSR (getServerSideProps)

```javascript
// pages/posts/[id].js
const PostPage = ({ post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <time>{new Date(post.createdAt).toLocaleDateString()}</time>
    </article>
  );
};

// This runs on the server for EVERY request
export const getServerSideProps = async (context) => {
  const { id } = context.params;

  // Fetch data from database/API
  const res = await fetch(`https://api.example.com/posts/${id}`);
  const post = await res.json();

  // Handle 404
  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post }, // Passed to component as props
  };
};

export default PostPage;
```

### SSR: Pros & Cons

| Pros | Cons |
|------|------|
| ✅ Excellent SEO | ❌ Server load for each request |
| ✅ Fast First Contentful Paint | ❌ Slower Time to First Byte (TTFB) |
| ✅ Fresh data on every request | ❌ Requires Node.js server |
| ✅ Social media previews work | ❌ Higher infrastructure cost |
| ✅ Works without JavaScript | ❌ Can't cache HTML easily |

### When to Use SSR

- **E-commerce product pages** (SEO + fresh prices/availability)
- **News articles** (SEO + real-time content)
- **Social platforms** (dynamic, personalized content)
- **Search results pages** (SEO + fresh data)

---

## 4️⃣ Static Site Generation (SSG)

### What is SSG?

Static Site Generation pre-renders all pages at **build time**. HTML files are generated once and served directly from a CDN.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SSG RENDERING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════ BUILD TIME ═══════════════                     │
│                                                                 │
│  Build Process     Database                                     │
│       │               │                                         │
│       │───Fetch all───▶│                                         │
│       │    data        │                                         │
│       │◀──────────────│                                         │
│       │                                                         │
│       ├──────────────────────────────────────┐                  │
│       │ For each page:                       │                  │
│       │ 1. Generate HTML                     │                  │
│       │ 2. Create static file                │                  │
│       │ 3. Deploy to CDN                     │                  │
│       └──────────────────────────────────────┘                  │
│                                                                 │
│       Output: /posts/1.html, /posts/2.html, /about.html...      │
│                                                                 │
│  ═══════════════ REQUEST TIME ═══════════════                   │
│                                                                 │
│  Browser              CDN                                       │
│     │                  │                                        │
│     │───GET /posts/1───▶│                                        │
│     │                  │                                        │
│     │◀──Static HTML────│  (instant, no server processing)       │
│     │                  │                                        │
│     │  User sees content immediately!                           │
│     │                                                           │
│                                                                 │
│  Timeline:                                                      │
│  ├────────┤                                                     │
│  0       HTML received + visible (FAST!)                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SSG Implementation

#### Next.js SSG (getStaticProps + getStaticPaths)

```javascript
// pages/posts/[slug].js
const BlogPost = ({ post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

// Generate list of all possible paths at build time
export const getStaticPaths = async () => {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  // Create paths array for all posts
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false, // Return 404 for unknown paths
    // fallback: 'blocking' // Generate on-demand for new paths
  };
};

// Fetch data for each page at build time
export const getStaticProps = async ({ params }) => {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`);
  const post = await res.json();

  return {
    props: { post },
  };
};

export default BlogPost;
```

#### Gatsby SSG Example

```javascript
// gatsby-node.js
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Query all posts at build time
  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `);

  // Generate a page for each post
  result.data.allMarkdownRemark.nodes.forEach(node => {
    createPage({
      path: `/posts/${node.frontmatter.slug}`,
      component: require.resolve('./src/templates/post.js'),
      context: {
        slug: node.frontmatter.slug,
      },
    });
  });
};
```

### SSG: Pros & Cons

| Pros | Cons |
|------|------|
| ✅ Fastest possible load times | ❌ Data becomes stale |
| ✅ Cheap hosting (CDN/static) | ❌ Rebuild needed for updates |
| ✅ Excellent SEO | ❌ Long build times for large sites |
| ✅ Highly scalable | ❌ Not suitable for dynamic content |
| ✅ Great security (no server) | ❌ Can't personalize per user |

### When to Use SSG

- **Marketing websites** (content changes rarely)
- **Documentation sites** (versioned, infrequent updates)
- **Blogs** (content added, not changed frequently)
- **Portfolio sites** (static content)
- **Landing pages** (SEO critical, content stable)

---

## 5️⃣ Incremental Static Regeneration (ISR)

### What is ISR?

ISR combines the best of SSG and SSR. Pages are statically generated but can be **regenerated in the background** when data changes.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ISR RENDERING FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════ INITIAL BUILD ═══════════════                  │
│                                                                 │
│  [Same as SSG - pages generated at build time]                  │
│                                                                 │
│  ═══════════════ REQUEST TIME ═══════════════                   │
│                                                                 │
│  Browser              CDN/Server                                │
│     │                     │                                     │
│     │────GET /posts/1─────▶│                                     │
│     │                     │                                     │
│     │◀───Cached HTML──────│  (instant response)                 │
│     │    (stale-while-    │                                     │
│     │     revalidate)     │                                     │
│     │                     │                                     │
│     │                     ├─────────────────────────┐           │
│     │                     │ Background:             │           │
│     │                     │ 1. Check if stale       │           │
│     │                     │ 2. If yes, regenerate   │           │
│     │                     │ 3. Cache new HTML       │           │
│     │                     └─────────────────────────┘           │
│     │                     │                                     │
│     │  Next request gets fresh HTML!                            │
│     │                                                           │
│                                                                 │
│  Revalidation Strategy:                                         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Request 1: Serve cached (fast) → Trigger regenerate │       │
│  │  Request 2: Serve NEW cached version                 │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### ISR Implementation

#### Next.js ISR (revalidate)

```javascript
// pages/products/[id].js
const ProductPage = ({ product }) => {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>Stock: {product.inventory}</p>
    </div>
  );
};

export const getStaticPaths = async () => {
  // Only pre-render top products at build time
  const res = await fetch('https://api.example.com/products?top=100');
  const products = await res.json();

  const paths = products.map(product => ({
    params: { id: product.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // Generate other pages on-demand
  };
};

export const getStaticProps = async ({ params }) => {
  const res = await fetch(`https://api.example.com/products/${params.id}`);
  const product = await res.json();

  return {
    props: { product },
    revalidate: 60, // Regenerate page at most every 60 seconds
  };
};

export default ProductPage;
```

#### On-Demand ISR (Next.js 12.1+)

```javascript
// pages/api/revalidate.js
export default async function handler(req, res) {
  // Verify secret to ensure legitimate request
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Revalidate specific path immediately
    await res.revalidate(`/products/${req.query.id}`);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}

// Usage: POST /api/revalidate?secret=xxx&id=123
// Triggered by CMS webhook when product updates
```

### ISR: Pros & Cons

| Pros | Cons |
|------|------|
| ✅ Fast like SSG | ❌ Slight data staleness |
| ✅ Fresh data (configurable) | ❌ Requires ISR-capable host |
| ✅ No rebuild for updates | ❌ More complex than pure SSG |
| ✅ Scales well | ❌ Cold start for new pages |
| ✅ Great for large sites | ❌ Not real-time |

### When to Use ISR

- **E-commerce** (product pages with price updates)
- **Large content sites** (news with thousands of articles)
- **Marketing sites** (frequent but not real-time updates)
- **Documentation** (versioned with occasional corrections)

---

## 6️⃣ Hydration: Bridging Server & Client

### What is Hydration?

Hydration is the process of attaching JavaScript event listeners and state to server-rendered HTML, making it interactive.

```
┌─────────────────────────────────────────────────────────────────┐
│                    HYDRATION PROCESS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVER OUTPUT                          CLIENT HYDRATION        │
│  ─────────────                          ─────────────────       │
│                                                                 │
│  <button class="btn">                   <button class="btn">    │
│    Click me                               Click me              │
│  </button>                              </button>               │
│       │                                      │                  │
│       │ Static HTML                          │ Interactive      │
│       │ (visible but dead)                   │ (event handlers) │
│       │                                      │                  │
│       └──────────────────────────────────────┘                  │
│                       │                                         │
│                       ▼                                         │
│         ┌──────────────────────────────┐                        │
│         │      HYDRATION PROCESS       │                        │
│         ├──────────────────────────────┤                        │
│         │ 1. React receives HTML       │                        │
│         │ 2. Builds virtual DOM        │                        │
│         │ 3. Compares with real DOM    │                        │
│         │ 4. Attaches event listeners  │                        │
│         │ 5. Sets up state/hooks       │                        │
│         │ 6. Component now interactive │                        │
│         └──────────────────────────────┘                        │
│                                                                 │
│                                                                 │
│  TIMELINE:                                                      │
│  ┌────────┬───────────────┬────────────────┐                    │
│  │  HTML  │  JS Download  │   Hydration    │                    │
│  │Visible │   + Parse     │   Complete     │                    │
│  └────────┴───────────────┴────────────────┘                    │
│     │            │               │                              │
│     │            │               └── Page Interactive           │
│     │            └── Page visible but NOT interactive           │
│     └── Content visible (FCP)                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Hydration Code Example

```javascript
// Server: renderToString (generates HTML)
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// Output: <div class="app"><button class="btn">Click me</button></div>

// Client: hydrateRoot (attaches interactivity)
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
// Now the button responds to clicks!
```

### Hydration Mismatch Errors

```javascript
// ❌ WRONG: Will cause hydration mismatch
const App = () => {
  // Different on server vs client
  const time = new Date().toLocaleTimeString();

  return <p>Current time: {time}</p>;
};

// ✅ CORRECT: Use useEffect for client-only values
const App = () => {
  const [time, setTime] = useState(null);

  useEffect(() => {
    // Only runs on client
    setTime(new Date().toLocaleTimeString());
  }, []);

  return <p>Current time: {time || 'Loading...'}</p>;
};

// ✅ CORRECT: suppressHydrationWarning for expected mismatches
const App = () => {
  return (
    <p suppressHydrationWarning>
      Current time: {new Date().toLocaleTimeString()}
    </p>
  );
};
```

### Hydration Performance Issues

```javascript
// ❌ Problem: Full hydration blocks interactivity
// Large app = long hydration time

// ✅ Solution 1: Progressive Hydration
const HeavyComponent = lazy(() => import('./HeavyComponent'));

const App = () => {
  return (
    <div>
      <Header /> {/* Hydrates immediately */}
      <Suspense fallback={<Loading />}>
        <HeavyComponent /> {/* Hydrates later */}
      </Suspense>
    </div>
  );
};

// ✅ Solution 2: Selective Hydration (React 18)
// React automatically prioritizes hydration based on user interaction
```

---

## 7️⃣ Streaming SSR

### What is Streaming SSR?

Streaming SSR sends HTML to the browser in chunks as it's generated, instead of waiting for the entire page.

```
┌─────────────────────────────────────────────────────────────────┐
│            STREAMING SSR vs TRADITIONAL SSR                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TRADITIONAL SSR:                                               │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ Server waits for ALL data, then sends complete HTML │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                 │
│  Time: ──────────────────────────────────┬────────────▶         │
│        │                                 │                      │
│        │ Server rendering (blocked)      │ HTML sent            │
│        │ Fetching data...                │ User sees page       │
│        │ Still fetching...               │                      │
│        │ Rendering HTML...               │                      │
│        └─────────────────────────────────┘                      │
│                                                                 │
│  STREAMING SSR:                                                 │
│  ┌─────────────────────────────────────────────────────┐        │
│  │ Server sends HTML chunks as they become ready       │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                 │
│  Time: ──┬──────┬──────┬──────┬───────────────────────▶         │
│          │      │      │      │                                 │
│          │      │      │      └─ Comments loaded                │
│          │      │      └─ Post content arrives                  │
│          │      └─ Sidebar renders                              │
│          └─ Shell + Header sent immediately!                    │
│                                                                 │
│  User sees progressive content!                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Streaming SSR with React 18

```javascript
// server.js - Using renderToPipeableStream
import { renderToPipeableStream } from 'react-dom/server';
import express from 'express';
import App from './App';

const app = express();

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/bundle.js'],

    onShellReady() {
      // Shell is ready (non-suspended content)
      // Start streaming immediately
      res.statusCode = 200;
      pipe(res);
    },

    onShellError(error) {
      // Error before shell ready - send error page
      res.statusCode = 500;
      res.send('<!DOCTYPE html><html><body>Error!</body></html>');
    },

    onAllReady() {
      // Everything including Suspense boundaries is ready
      // For crawlers, you might wait for this instead
    },

    onError(error) {
      console.error(error);
    },
  });

  // Abort after timeout
  setTimeout(() => abort(), 10000);
});
```

### Streaming with Suspense

```javascript
// App.jsx - Streaming with Suspense boundaries
import { Suspense } from 'react';

// Async component that fetches data
const Comments = async ({ postId }) => {
  const comments = await fetchComments(postId);
  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
};

const App = () => {
  return (
    <html>
      <head><title>Streaming Demo</title></head>
      <body>
        {/* This renders immediately */}
        <Header />

        {/* This streams when ready */}
        <main>
          <Article />

          {/* Comments stream separately */}
          <Suspense fallback={<p>Loading comments...</p>}>
            <Comments postId={1} />
          </Suspense>
        </main>

        <Footer />
      </body>
    </html>
  );
};
```

### Streaming Output Example

```html
<!-- Initial chunk (shell) - sent immediately -->
<!DOCTYPE html>
<html>
<head><title>Streaming Demo</title></head>
<body>
  <header>My Blog</header>
  <main>
    <article>Post content here...</article>
    <template id="comments-placeholder">
      <p>Loading comments...</p>
    </template>
  </main>
  <footer>Copyright 2024</footer>

<!-- Later chunk - streamed when data ready -->
<script>
  // Swap placeholder with actual content
  const placeholder = document.getElementById('comments-placeholder');
  placeholder.outerHTML = `
    <ul>
      <li>Great post!</li>
      <li>Thanks for sharing</li>
    </ul>
  `;
</script>
```

---

## 8️⃣ React Server Components (RSC)

### What are React Server Components?

RSC is a paradigm where components run **only on the server** and send rendered UI (not JavaScript) to the client.

```
┌─────────────────────────────────────────────────────────────────┐
│            REACT SERVER COMPONENTS ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SERVER                                │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │   ┌─────────────────┐                                   │    │
│  │   │ Server Component│  - Runs ONLY on server            │    │
│  │   │   (*.server.js) │  - Can access DB directly         │    │
│  │   │                 │  - Zero JS sent to client         │    │
│  │   │ async function  │  - Can use await                  │    │
│  │   │  Component()    │                                   │    │
│  │   └────────┬────────┘                                   │    │
│  │            │                                            │    │
│  │            ▼ Renders to RSC Payload (not HTML)          │    │
│  │            │                                            │    │
│  └────────────┼────────────────────────────────────────────┘    │
│               │                                                 │
│               ▼                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    CLIENT                                │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │   ┌─────────────────┐                                   │    │
│  │   │ Client Component│  - Runs on client (and server)    │    │
│  │   │   'use client'  │  - Needs interactivity            │    │
│  │   │                 │  - useState, onClick, etc.        │    │
│  │   │                 │  - JS bundle sent to client       │    │
│  │   └─────────────────┘                                   │    │
│  │                                                         │    │
│  │   RSC Payload + Client Components = Interactive UI      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Server Component Example

```javascript
// app/posts/[id]/page.js (Next.js 13+ App Router)
// This is a Server Component by default!

// Can use async/await directly
const PostPage = async ({ params }) => {
  // Direct database access (no API needed!)
  const post = await db.posts.findUnique({
    where: { id: params.id },
  });

  // Can use server-only code
  const enrichedContent = await processMarkdown(post.content);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: enrichedContent }} />

      {/* Client Component for interactivity */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  );
};

export default PostPage;
```

### Client Component Example

```javascript
// components/LikeButton.js
'use client'; // Mark as Client Component

import { useState } from 'react';

const LikeButton = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);

    // API call for persistence
    await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
    });
  };

  return (
    <button onClick={handleLike}>
      {isLiked ? '❤️' : '🤍'} {likes} likes
    </button>
  );
};

export default LikeButton;
```

### Server vs Client Components

| Feature | Server Component | Client Component |
|---------|-----------------|------------------|
| Directive | None (default) | `'use client'` |
| Runs on | Server only | Server + Client |
| JS bundle | Zero | Included |
| useState/useEffect | ❌ No | ✅ Yes |
| Event handlers | ❌ No | ✅ Yes |
| async/await | ✅ Yes | ❌ No |
| Direct DB access | ✅ Yes | ❌ No |
| Access request | ✅ Yes | ❌ No |

### RSC Composition Patterns

```javascript
// ✅ Server Component rendering Client Component
// app/page.js (Server Component)
import InteractiveChart from './InteractiveChart';

const DashboardPage = async () => {
  const data = await fetchChartData();

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Pass server data to client component */}
      <InteractiveChart data={data} />
    </div>
  );
};

// ❌ Client Component CANNOT import Server Component
// components/InteractiveChart.js
'use client';

// This would be an error:
// import ServerOnlyComponent from './ServerOnlyComponent';

// ✅ But can receive Server Components as children
const ClientWrapper = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children} {/* Server Component passed as children */}
    </div>
  );
};
```

---

## 9️⃣ Comparison & Decision Framework

### Complete Rendering Strategy Matrix

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    RENDERING STRATEGY DECISION MATRIX                     │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Data Requirements vs Interactivity Needs                                 │
│                                                                           │
│                        Static Data          Dynamic Data                  │
│                            │                     │                        │
│  High Interactivity   ────┼─────────────────────┼────────────────         │
│  (SPA-like)               │                     │                         │
│                           │    ┌───────────┐    │   ┌───────────┐         │
│                           │    │    SSG    │    │   │    SSR    │         │
│                           │    │     +     │    │   │     +     │         │
│                           │    │   CSR     │    │   │   CSR     │         │
│                           │    │ Hydration │    │   │ Hydration │         │
│                           │    └───────────┘    │   └───────────┘         │
│                           │                     │                         │
│  Medium Interactivity ────┼─────────────────────┼────────────────         │
│  (Some dynamic parts)     │                     │                         │
│                           │    ┌───────────┐    │   ┌───────────┐         │
│                           │    │    ISR    │    │   │ Streaming │         │
│                           │    │           │    │   │    SSR    │         │
│                           │    └───────────┘    │   └───────────┘         │
│                           │                     │                         │
│  Low Interactivity   ─────┼─────────────────────┼────────────────         │
│  (Content sites)          │                     │                         │
│                           │    ┌───────────┐    │   ┌───────────┐         │
│                           │    │   Pure    │    │   │    RSC    │         │
│                           │    │    SSG    │    │   │ (minimal  │         │
│                           │    │           │    │   │ hydration)│         │
│                           │    └───────────┘    │   └───────────┘         │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### Decision Flowchart

```javascript
/*
Start
  │
  ├── Is SEO important?
  │   │
  │   ├── NO → CSR (SPA)
  │   │
  │   └── YES
  │       │
  │       ├── Does content change frequently?
  │       │   │
  │       │   ├── NO → SSG
  │       │   │
  │       │   └── YES
  │       │       │
  │       │       ├── Can it be stale for minutes?
  │       │       │   │
  │       │       │   ├── YES → ISR
  │       │       │   │
  │       │       │   └── NO → SSR
  │       │       │
  │       │       └── Is personalization needed?
  │       │           │
  │       │           ├── YES → SSR
  │       │           │
  │       │           └── NO → ISR
  │
  └── Need minimal JS bundle?
      │
      └── YES → RSC (React Server Components)
*/
```

### Practical Examples by Use Case

| Use Case | Recommended Strategy | Why |
|----------|---------------------|-----|
| **Marketing landing page** | SSG | Static, SEO critical, never changes |
| **Blog** | SSG + ISR | Content updates, SEO important |
| **E-commerce product page** | ISR or SSR | SEO + fresh prices |
| **E-commerce checkout** | CSR | Behind auth, highly interactive |
| **News article** | SSR or Streaming | Real-time, SEO critical |
| **Dashboard** | CSR | Behind auth, highly interactive |
| **Documentation** | SSG | Static, versioned |
| **Social media feed** | SSR + CSR | Personalized, SEO for public |
| **Search results** | SSR | Dynamic, SEO important |
| **Admin panel** | CSR | No SEO, highly interactive |

---

## 🔟 Common Interview Questions

### Q1: What's the difference between SSR and SSG?

**Answer:**
```
SSR (Server-Side Rendering):
- HTML generated on EVERY request
- Server processes each request
- Data always fresh
- Higher server load
- Example: Next.js getServerSideProps

SSG (Static Site Generation):
- HTML generated at BUILD time
- Pre-built files served from CDN
- Data can become stale
- Zero server load at runtime
- Example: Next.js getStaticProps
```

### Q2: What is hydration and why is it needed?

**Answer:**
```
Hydration is the process of attaching JavaScript event listeners
and state management to server-rendered HTML.

Why needed:
1. Server sends static HTML (fast, visible)
2. But HTML has no interactivity
3. React "hydrates" by:
   - Building virtual DOM from existing HTML
   - Attaching event handlers
   - Setting up hooks and state
4. Result: Interactive application

Without hydration: You'd see content but buttons wouldn't work!
```

### Q3: When would you choose CSR over SSR?

**Answer:**
```javascript
// Choose CSR when:
// 1. SEO doesn't matter (behind auth)
// 2. Content is highly personalized
// 3. Real-time interactivity is priority
// 4. Reducing server costs

// Examples:
// - Admin dashboards
// - Email clients
// - Internal tools
// - Highly interactive apps (Figma, spreadsheets)

// Choose SSR when:
// - SEO is critical
// - First contentful paint matters
// - Data must be fresh
// - Social media previews needed
```

### Q4: Explain the trade-offs of ISR

**Answer:**
```
ISR Pros:
- Fast like static (served from cache)
- Fresh-ish data (revalidates in background)
- No rebuild needed for updates
- Scales well (CDN cacheable)

ISR Cons:
- Data can be stale (up to revalidate period)
- First request after stale = still serves old
- Requires ISR-capable hosting
- Cold starts for new paths

Best for:
- E-commerce product pages
- News sites with many articles
- Content that updates but isn't real-time
```

### Q5: What are React Server Components?

**Answer:**
```javascript
// React Server Components (RSC):
// - Components that run ONLY on the server
// - Zero JavaScript sent to client
// - Can directly access databases
// - Can use async/await in component

// Example:
// Server Component (default in Next.js 13+)
async function BlogPost({ id }) {
  // Direct DB access - no API needed!
  const post = await db.posts.find(id);
  return <article>{post.content}</article>;
}

// vs Client Component
'use client';
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>Like</button>;
}

// Key benefit: Smaller bundles, faster loads
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: Hydration Mismatch

```javascript
// ❌ BAD: Different content server vs client
const Component = () => {
  // Math.random() gives different values!
  return <div>{Math.random()}</div>;
};

// ✅ GOOD: Consistent or handle in useEffect
const Component = () => {
  const [random, setRandom] = useState(null);

  useEffect(() => {
    setRandom(Math.random());
  }, []);

  return <div>{random ?? 'Loading...'}</div>;
};
```

### Pitfall 2: Over-using SSR

```javascript
// ❌ BAD: SSR for everything
// pages/dashboard.js
export async function getServerSideProps() {
  // This runs on EVERY request - expensive!
  const data = await fetchAllDashboardData();
  return { props: { data } };
}

// ✅ GOOD: CSR for authenticated dashboards
// pages/dashboard.js
const Dashboard = () => {
  const { data, isLoading } = useSWR('/api/dashboard');

  if (isLoading) return <Skeleton />;
  return <DashboardContent data={data} />;
};
```

### Pitfall 3: Massive Client Components

```javascript
// ❌ BAD: Everything is a client component
'use client';

const BlogPost = async ({ id }) => {
  // This entire component's JS goes to client!
  const post = await fetch(`/api/posts/${id}`);
  return <article>{post.content}</article>;
};

// ✅ GOOD: Keep client components small
// Server Component
const BlogPost = async ({ id }) => {
  const post = await db.posts.find(id);

  return (
    <article>
      {post.content}
      {/* Only interactive part is client */}
      <ShareButtons url={post.url} />
    </article>
  );
};

// Small Client Component
'use client';
const ShareButtons = ({ url }) => {
  return <button onClick={() => share(url)}>Share</button>;
};
```

### Pitfall 4: Not considering TTFB

```javascript
// ❌ BAD: Slow data fetching blocks SSR
export async function getServerSideProps() {
  // If this takes 3 seconds, TTFB = 3+ seconds!
  const data = await slowDatabaseQuery();
  return { props: { data } };
}

// ✅ GOOD: Use Streaming SSR for slow data
const Page = () => {
  return (
    <>
      <Header /> {/* Renders immediately */}
      <Suspense fallback={<Loading />}>
        <SlowDataComponent /> {/* Streams when ready */}
      </Suspense>
    </>
  );
};
```

---

## 📊 Performance Metrics by Strategy

| Strategy | TTFB | FCP | LCP | TTI | Bundle Size |
|----------|------|-----|-----|-----|-------------|
| **CSR** | Fast | Slow | Slow | Slow | Large |
| **SSR** | Slow | Fast | Fast | Medium | Medium |
| **SSG** | Fastest | Fastest | Fastest | Medium | Medium |
| **ISR** | Fast* | Fast | Fast | Medium | Medium |
| **Streaming** | Fast | Progressive | Progressive | Progressive | Medium |
| **RSC** | Medium | Fast | Fast | Fast | Smallest |

*After cached; first request to stale page is slower

---

## 🔍 Summary

### Key Takeaways

1. **CSR**: Best for SPAs behind authentication, prioritizes interactivity
2. **SSR**: Best for SEO + fresh data, but higher server costs
3. **SSG**: Fastest possible, but data becomes stale
4. **ISR**: Best of both worlds - fast + reasonably fresh
5. **Streaming SSR**: Progressive rendering for complex pages
6. **RSC**: Minimal JS bundles, server-only logic
7. **Hydration**: Critical bridge between server HTML and client interactivity

### Quick Reference

```javascript
// CSR: Interactive apps, no SEO
createRoot(document.getElementById('root')).render(<App />);

// SSR: SEO + fresh data (Next.js)
export async function getServerSideProps() { }

// SSG: Static content (Next.js)
export async function getStaticProps() { }

// ISR: Static + revalidation (Next.js)
export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}

// RSC: Server-only components (Next.js 13+)
// No directive = Server Component
async function Page() { }

// Client Component
'use client';
function InteractiveComponent() { }
```

---

## 📚 Related Resources

- [Browser Rendering](./browser_rendering.md) - How browsers render pages
- [Critical Rendering Path](./critical_rendering_path.md) - Performance optimization
- [Next.js Documentation](https://nextjs.org/docs) - Framework implementing all strategies
- [React Documentation](https://react.dev) - Official React docs

---

## 🌐 Further Reading

- [Patterns.dev - Rendering Patterns](https://www.patterns.dev/react/rendering-patterns)
- [web.dev - Rendering on the Web](https://web.dev/rendering-on-the-web/)
- [Next.js - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

<!-- quiz-start -->
### Q1: Which rendering strategy generates HTML at build time and serves it directly from a CDN?
- [ ] Server-Side Rendering (SSR)
- [x] Static Site Generation (SSG)
- [ ] Client-Side Rendering (CSR)
- [ ] Incremental Static Regeneration (ISR)

### Q2: What is the primary purpose of hydration in React?
- [ ] To generate HTML on the server
- [ ] To fetch data from APIs
- [x] To attach event listeners and state to server-rendered HTML, making it interactive
- [ ] To optimize images for web delivery

### Q3: When using React Server Components, which directive marks a component as a Client Component?
- [ ] 'use server'
- [x] 'use client'
- [ ] 'use interactive'
- [ ] No directive needed, it's automatic
<!-- quiz-end -->
