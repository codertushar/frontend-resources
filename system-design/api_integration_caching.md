---
date: 2025-12-11T21:34:56+05:30
description: Master API integration patterns including caching strategies, retry logic, circuit breakers, and data orchestration for scalable systems.
---

# 🌐 System Design: API Integration, Data Orchestration & Caching (Staff Engineer Interview Guide)

**Target Level:** Staff Engineer / Principal Engineer  
**Duration:** 45-60 minutes  
**Interview Focus:** Distributed Systems, Cache Strategies, API Design, Performance, Observability

---

## Interview Approach & What Interviewers Look For

When asked to architect data fetching and caching for a complex application with multiple interacting data domains, interviewers are evaluating:

1. **Staleness Policy:** Can you define when cached data becomes stale and needs refreshing?
2. **Cache Invalidation Strategy:** Do you understand the hard problems of cache invalidation and have strategies to handle it?
3. **Handling Waterfalls and Concurrency:** Can you prevent sequential API calls and optimize parallel fetching?
4. **Observability for API Failures:** How do you monitor, track, and debug API failures in production?
5. **Retry/Backoff Policies:** Do you implement resilient systems that gracefully handle transient failures?
6. **Correctness Under Distributed Conditions:** Can you reason about race conditions, eventual consistency, and data integrity?

**Pro Tip:** Staff engineers must think beyond basic caching. Focus on distributed system challenges, data consistency, and building observable, resilient systems at scale.

---

## 1. Clarifying Questions (First 5 minutes)

Before diving in, ask these questions to scope the problem:

**Data Domain Complexity:**
- "How many distinct data domains are we dealing with? (e.g., user, products, orders, inventory, reviews)"
- "What are the relationships between domains? Do they depend on each other?"
- "Are there any eventually consistent domains (e.g., analytics, recommendations)?"
- "What's the read:write ratio for each domain?"

**Scale & Performance:**
- "How many concurrent users? 10k? 1M? 10M?"
- "What's the target p99 latency for data fetching? <100ms? <500ms?"
- "What's the data size per domain? KB? MB? GB?"
- "What's the acceptable staleness for each domain? Real-time? Minutes? Hours?"

**Technical Constraints:**
- "Do we have control over the backend APIs, or are they third-party?"
- "Are the APIs RESTful, GraphQL, gRPC, or mixed?"
- "Do we need offline support or optimistic updates?"
- "What's the browser/device support? Modern browsers only?"

**Consistency Requirements:**
- "Can we tolerate stale data, or must it always be consistent?"
- "Do we need real-time updates (WebSockets/SSE), or is polling acceptable?"
- "How do we handle conflicts when the same data is updated from multiple sources?"

---

## 2. High-Level Architecture (Draw This!)

```
+-----------------------------------------------------------------+
|                     Frontend Application                         |
|                                                                  |
|  +------------------------------------------------------------+ |
|  |                   UI Components Layer                       | |
|  |  • Product List  • User Profile  • Cart  • Reviews        | |
|  +------------------------------------------------------------+ |
|                           ↕                                      |
|  +------------------------------------------------------------+ |
|  |              Data Orchestration Layer                       | |
|  |  +------------------------------------------------------+  | |
|  |  |    Query Manager (React Query / SWR / Relay)        |  | |
|  |  |  • Query Deduplication  • Request Batching          |  | |
|  |  |  • Parallel Fetching    • Waterfall Prevention      |  | |
|  |  +------------------------------------------------------+  | |
|  |                           ↕                                 | |
|  |  +------------------------------------------------------+  | |
|  |  |           Cache Layer (Multi-Level)                  |  | |
|  |  |  +-----------+-----------+------------+             |  | |
|  |  |  |  Memory   | IndexedDB |  Service   |             |  | |
|  |  |  |  Cache    |   Cache   |  Worker    |             |  | |
|  |  |  |  (L1)     |   (L2)    |  (L3)      |             |  | |
|  |  |  +-----------+-----------+------------+             |  | |
|  |  |  • TTL-based Expiration  • LRU Eviction             |  | |
|  |  |  • Tag-based Invalidation                           |  | |
|  |  +------------------------------------------------------+  | |
|  +------------------------------------------------------------+ |
|                           ↕                                      |
|  +------------------------------------------------------------+ |
|  |              API Client Layer                               | |
|  |  +------------------------------------------------------+  | |
|  |  |    Request Interceptor                               |  | |
|  |  |  • Authentication  • Rate Limiting  • Retry Logic   |  | |
|  |  +------------------------------------------------------+  | |
|  |                           ↕                                 | |
|  |  +------------------------------------------------------+  | |
|  |  |    Response Interceptor                              |  | |
|  |  |  • Error Handling  • Logging  • Metrics             |  | |
|  |  +------------------------------------------------------+  | |
|  +------------------------------------------------------------+ |
|                           ↕                                      |
|  +------------------------------------------------------------+ |
|  |          Observability Layer                                | |
|  |  • Error Tracking (Sentry)  • Metrics (DataDog)           | |
|  |  • Logging (Structured)     • Tracing (OpenTelemetry)     | |
|  +------------------------------------------------------------+ |
+-----------------------------------------------------------------+
                           ↕
        +--------------------------------------+
        |         Backend Services              |
        |  +------------+-----------------+   |
        |  |  User API  |  Product API    |   |
        |  +------------+-----------------+   |
        |  |  Cart API  |  Inventory API  |   |
        |  +------------+-----------------+   |
        |  |  Order API |  Review API     |   |
        |  +------------+-----------------+   |
        +--------------------------------------+
```

**Key Talking Points:**
- **Multi-level caching:** L1 (memory), L2 (IndexedDB), L3 (Service Worker)
- **Orchestration layer:** Coordinates data fetching across multiple domains
- **Deduplication:** Prevents duplicate requests for the same data
- **Observability:** Built-in monitoring at every layer
- **Interceptors:** Centralized handling of auth, retries, logging

---

## 3. Core Technical Decisions

### 3.1 Staleness Policy — When is Data "Fresh"?

**The Problem:** Different data has different freshness requirements.

| Data Domain | Staleness Tolerance | Strategy |
|------------|---------------------|----------|
| User Profile | 5 minutes | Time-based (TTL) |
| Product Catalog | 1 hour | Time-based (TTL) |
| Shopping Cart | Real-time | Event-based invalidation |
| Inventory Count | 30 seconds | Stale-while-revalidate |
| Reviews | 1 day | Background refresh |
| Analytics | 1 hour | Periodic refresh |

**Implementation: Time-To-Live (TTL) with Stale-While-Revalidate**

```javascript
// Cache entry with TTL and staleness metadata
const createCacheEntry = (data, ttl = 5 * 60 * 1000) => ({
  data,
  timestamp: Date.now(),
  ttl,
  staleAt: Date.now() + ttl,
  expireAt: Date.now() + ttl * 2, // Grace period for stale-while-revalidate
});

// Staleness checker
const isFresh = (entry) => Date.now() < entry.staleAt;
const isExpired = (entry) => Date.now() > entry.expireAt;
const isStale = (entry) => !isFresh(entry) && !isExpired(entry);

// Stale-while-revalidate pattern
const fetchWithSWR = async (key, fetcher, cache) => {
  const cached = cache.get(key);
  
  // Return immediately if fresh
  if (cached && isFresh(cached)) {
    return cached.data;
  }
  
  // Return stale data but revalidate in background
  if (cached && isStale(cached)) {
    // Trigger background revalidation (fire-and-forget)
    fetcher().then(data => {
      cache.set(key, createCacheEntry(data));
    }).catch(err => {
      console.error('Background revalidation failed:', err);
    });
    
    return cached.data; // Return stale data immediately
  }
  
  // Fetch fresh data if expired or missing
  const data = await fetcher();
  cache.set(key, createCacheEntry(data));
  return data;
};
```

**🔍 Dry Run Example:**

```
Scenario: User visits product page

Step 1: fetchWithSWR('product:123', fetchProduct, cache)
---------------------------------------------------------
  cached = cache.get('product:123') = {
    data: { id: 123, name: 'Laptop' },
    timestamp: 1700000000000,
    staleAt: 1700003600000,  // +1 hour
    expireAt: 1700007200000  // +2 hours
  }
  Date.now() = 1700003000000
  isFresh(cached) = (1700003000000 < 1700003600000) = true ✅
  Action: Return cached.data immediately
  Result: { id: 123, name: 'Laptop' }

Step 2: User revisits after 90 minutes
---------------------------------------------------------
  cached = (same as above)
  Date.now() = 1700008400000
  isFresh(cached) = false ❌
  isStale(cached) = false (expired)
  isExpired(cached) = true
  Action: Fetch fresh data from API
  API Response: { id: 123, name: 'Gaming Laptop', price: 1299 }
  cache.set('product:123', createCacheEntry(newData))
  Result: { id: 123, name: 'Gaming Laptop', price: 1299 }
```

---

### 3.2 Cache Invalidation Strategy — "There are only two hard things..."

**The Problem:** Phil Karlton said, "There are only two hard things in Computer Science: cache invalidation and naming things."

**Strategies:**

#### 1️⃣ **Tag-Based Invalidation**

```javascript
// Cache with tag tracking
class TaggedCache {
  constructor() {
    this.cache = new Map(); // key -> { data, tags }
    this.tagIndex = new Map(); // tag -> Set(keys)
  }
  
  set(key, data, tags = []) {
    this.cache.set(key, { data, tags });
    
    // Update tag index
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag).add(key);
    });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    return entry?.data;
  }
  
  // Invalidate all entries with a specific tag
  invalidateTag(tag) {
    const keys = this.tagIndex.get(tag) || new Set();
    keys.forEach(key => this.cache.delete(key));
    this.tagIndex.delete(tag);
    
    console.log(`Invalidated ${keys.size} entries with tag: ${tag}`);
  }
  
  // Invalidate multiple tags atomically
  invalidateTags(tags) {
    tags.forEach(tag => this.invalidateTag(tag));
  }
}

// Usage
const cache = new TaggedCache();

// Cache user's cart with relevant tags
cache.set('cart:user123', cartData, ['user:123', 'cart', 'product:456']);

// When user logs out, invalidate all their data
cache.invalidateTag('user:123'); // Clears cart, profile, orders, etc.

// When product 456 is updated, invalidate all caches containing it
cache.invalidateTag('product:456'); // Clears cart, product details, etc.
```

#### 2️⃣ **Event-Based Invalidation**

```javascript
// Event-driven cache invalidation
class EventDrivenCache {
  constructor() {
    this.cache = new Map();
    this.eventBus = new EventTarget();
    
    // Subscribe to domain events
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Product updated event
    this.eventBus.addEventListener('product:updated', (event) => {
      const { productId } = event.detail;
      this.invalidatePattern(`product:${productId}`);
      this.invalidatePattern(`catalog:*`); // Invalidate catalog pages
    });
    
    // Cart modified event
    this.eventBus.addEventListener('cart:modified', (event) => {
      const { userId } = event.detail;
      this.invalidatePattern(`cart:${userId}`);
      this.invalidatePattern(`checkout:${userId}`);
    });
    
    // User updated event
    this.eventBus.addEventListener('user:updated', (event) => {
      const { userId } = event.detail;
      this.invalidatePattern(`user:${userId}`);
    });
  }
  
  invalidatePattern(pattern) {
    // Convert glob pattern to regex
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*') + '$'
    );
    
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`Invalidated ${keysToDelete.length} entries matching: ${pattern}`);
  }
  
  // Emit event from application
  emit(event, detail) {
    this.eventBus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

// Usage
const cache = new EventDrivenCache();

// When user updates their cart
const addToCart = async (userId, productId) => {
  await api.post('/cart', { userId, productId });
  
  // Trigger cache invalidation
  cache.emit('cart:modified', { userId });
  cache.emit('product:updated', { productId }); // Update inventory
};
```

#### 3️⃣ **Optimistic Updates with Rollback**

```javascript
// Optimistic update with automatic rollback on failure
const optimisticUpdate = async (key, updateFn, apiCall, cache) => {
  const previous = cache.get(key);
  
  try {
    // Apply optimistic update immediately
    const optimistic = updateFn(previous);
    cache.set(key, optimistic);
    
    // Call API
    const result = await apiCall();
    
    // Update with server response
    cache.set(key, result);
    
    return result;
  } catch (error) {
    // Rollback to previous state on failure
    if (previous) {
      cache.set(key, previous);
    } else {
      cache.delete(key);
    }
    
    throw error;
  }
};

// Usage: Liking a post
const likePost = async (postId) => {
  await optimisticUpdate(
    `post:${postId}`,
    (post) => ({ ...post, likes: post.likes + 1, liked: true }),
    () => api.post(`/posts/${postId}/like`),
    cache
  );
};
```

---

### 3.3 Handling Waterfalls and Concurrency

**The Problem:** Sequential API calls create waterfalls that increase latency.

```
❌ BAD: Sequential Waterfall
-----------------------------
GET /user          ----------►  200ms
                              GET /cart  ----------►  200ms
                                                    GET /products  ----------►  200ms
Total: 600ms

✅ GOOD: Parallel Fetching
-----------------------------
GET /user      ----------►  200ms
GET /cart      ----------►  200ms
GET /products  ----------►  200ms
Total: 200ms (3x faster!)
```

**Solution 1: Parallel Fetching with Promise.all**

```javascript
// Fetch multiple independent resources in parallel
const fetchDashboardData = async (userId) => {
  try {
    const [user, cart, products, recommendations] = await Promise.all([
      fetchUser(userId),
      fetchCart(userId),
      fetchProducts(),
      fetchRecommendations(userId),
    ]);
    
    return { user, cart, products, recommendations };
  } catch (error) {
    // Problem: If ANY request fails, ALL data is lost
    throw error;
  }
};
```

**Solution 2: Parallel Fetching with Promise.allSettled (More Resilient)**

```javascript
// Fetch in parallel but handle partial failures gracefully
const fetchDashboardData = async (userId) => {
  const results = await Promise.allSettled([
    fetchUser(userId),
    fetchCart(userId),
    fetchProducts(),
    fetchRecommendations(userId),
  ]);
  
  // Extract successful responses and log failures
  const [userResult, cartResult, productsResult, recsResult] = results;
  
  return {
    user: userResult.status === 'fulfilled' ? userResult.value : null,
    cart: cartResult.status === 'fulfilled' ? cartResult.value : null,
    products: productsResult.status === 'fulfilled' ? productsResult.value : [],
    recommendations: recsResult.status === 'fulfilled' ? recsResult.value : [],
    errors: results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason),
  };
};
```

**Solution 3: Dependent Requests with Optimized Batching**

```javascript
// When requests have dependencies, minimize waterfalls
const fetchUserWithOrders = async (userId) => {
  // Step 1: Fetch user
  const user = await fetchUser(userId);
  
  // Step 2: Fetch dependent data in parallel
  const [orders, preferences, activity] = await Promise.all([
    fetchOrders(user.id),
    fetchPreferences(user.id),
    fetchActivity(user.id),
  ]);
  
  return { user, orders, preferences, activity };
};
```

**Solution 4: Request Deduplication**

```javascript
// Prevent duplicate in-flight requests
class RequestDeduplicator {
  constructor() {
    this.inFlight = new Map(); // key -> Promise
  }
  
  async fetch(key, fetcher) {
    // Return existing promise if request is already in-flight
    if (this.inFlight.has(key)) {
      console.log(`Deduplicating request: ${key}`);
      return this.inFlight.get(key);
    }
    
    // Start new request
    const promise = fetcher()
      .finally(() => {
        // Clean up when done
        this.inFlight.delete(key);
      });
    
    this.inFlight.set(key, promise);
    return promise;
  }
}

// Usage
const deduplicator = new RequestDeduplicator();

// Multiple components request the same data
const ProductPage = () => {
  // These 3 calls will be deduplicated into 1 request
  useEffect(() => {
    deduplicator.fetch('product:123', () => fetchProduct(123));
  }, []);
};

const ProductReviews = () => {
  useEffect(() => {
    deduplicator.fetch('product:123', () => fetchProduct(123));
  }, []);
};

const RelatedProducts = () => {
  useEffect(() => {
    deduplicator.fetch('product:123', () => fetchProduct(123));
  }, []);
};
```

---

### 3.4 Observability for API Failures

**The Problem:** In production, APIs fail silently and debugging is nearly impossible without proper observability.

**Solution: Structured Logging and Metrics**

```javascript
// API client with comprehensive observability
class ObservableAPIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.metrics = options.metrics || console; // DataDog, Prometheus, etc.
    this.logger = options.logger || console;
    this.tracer = options.tracer || null; // OpenTelemetry
  }
  
  async request(method, path, options = {}) {
    const startTime = Date.now();
    const traceId = this.generateTraceId();
    const requestContext = {
      method,
      path,
      traceId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...options.context,
    };
    
    try {
      // Log request start
      this.logger.info('API request started', requestContext);
      
      // Start trace span
      const span = this.tracer?.startSpan('http.request', {
        attributes: { method, path, traceId },
      });
      
      // Make request
      const response = await fetch(`${this.baseURL}${path}`, {
        method,
        ...options,
        headers: {
          'X-Trace-Id': traceId,
          ...options.headers,
        },
      });
      
      const duration = Date.now() - startTime;
      
      // Log response
      this.logger.info('API request completed', {
        ...requestContext,
        status: response.status,
        duration,
      });
      
      // Record metrics
      this.metrics.histogram('api.request.duration', duration, {
        method,
        path,
        status: response.status,
      });
      
      this.metrics.increment('api.request.count', {
        method,
        path,
        status: response.status,
      });
      
      // End trace span
      span?.setStatus({ code: response.ok ? 0 : 1 });
      span?.end();
      
      // Handle errors
      if (!response.ok) {
        const error = new APIError(
          `Request failed: ${response.status}`,
          response.status,
          requestContext
        );
        
        // Send error to monitoring
        this.reportError(error, requestContext, duration);
        
        throw error;
      }
      
      return response.json();
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error with full context
      this.logger.error('API request failed', {
        ...requestContext,
        error: error.message,
        stack: error.stack,
        duration,
      });
      
      // Record error metrics
      this.metrics.increment('api.request.error', {
        method,
        path,
        errorType: error.name,
      });
      
      // Report to error tracking (Sentry)
      this.reportError(error, requestContext, duration);
      
      throw error;
    }
  }
  
  reportError(error, context, duration) {
    // Send to Sentry/Bugsnag/etc.
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        tags: {
          api_method: context.method,
          api_path: context.path,
          trace_id: context.traceId,
        },
        extra: {
          ...context,
          duration,
        },
      });
    }
  }
  
  generateTraceId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Custom error class
class APIError extends Error {
  constructor(message, status, context) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.context = context;
  }
}
```

**Key Observability Metrics to Track:**

| Metric | Type | Purpose |
|--------|------|---------|
| `api.request.duration` | Histogram | Latency distribution (p50, p95, p99) |
| `api.request.count` | Counter | Request volume by endpoint |
| `api.request.error` | Counter | Error rate by type |
| `api.cache.hit_rate` | Gauge | Cache effectiveness |
| `api.retry.count` | Counter | Retry frequency |
| `api.circuit_breaker.state` | Gauge | Circuit breaker status |

---

### 3.5 Retry/Backoff Policies

**The Problem:** Transient network failures can be retried, but naive retries can make things worse.

**Solution: Exponential Backoff with Jitter**

```javascript
// Sophisticated retry mechanism with exponential backoff
class RetryPolicy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000; // 1 second
    this.maxDelay = options.maxDelay || 30000; // 30 seconds
    this.jitter = options.jitter !== false; // Add jitter by default
    this.retryableErrors = options.retryableErrors || [408, 429, 500, 502, 503, 504];
  }
  
  // Calculate delay with exponential backoff and jitter
  calculateDelay(attempt) {
    // Exponential: 1s, 2s, 4s, 8s, 16s
    const exponentialDelay = Math.min(
      this.baseDelay * Math.pow(2, attempt),
      this.maxDelay
    );
    
    if (!this.jitter) {
      return exponentialDelay;
    }
    
    // Add jitter to prevent thundering herd
    // Random value between 50% and 100% of exponential delay
    const jitterFactor = 0.5 + Math.random() * 0.5;
    return Math.floor(exponentialDelay * jitterFactor);
  }
  
  isRetryable(error) {
    // Network errors are retryable
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return true;
    }
    
    // Specific status codes are retryable
    if (error.status && this.retryableErrors.includes(error.status)) {
      return true;
    }
    
    return false;
  }
  
  async executeWithRetry(fn, context = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        // Attempt the request
        const result = await fn();
        
        // Log success if it was a retry
        if (attempt > 0) {
          console.log(`Request succeeded after ${attempt} retries`, context);
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        
        // Check if we should retry
        if (attempt < this.maxRetries && this.isRetryable(error)) {
          const delay = this.calculateDelay(attempt);
          
          console.warn(
            `Request failed (attempt ${attempt + 1}/${this.maxRetries + 1}), ` +
            `retrying in ${delay}ms`,
            { error: error.message, ...context }
          );
          
          // Wait before retrying
          await this.sleep(delay);
          
        } else {
          // No more retries or error is not retryable
          console.error(
            `Request failed permanently after ${attempt + 1} attempts`,
            { error: error.message, ...context }
          );
          
          throw error;
        }
      }
    }
    
    throw lastError;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage with API client
const retryPolicy = new RetryPolicy({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
});

const fetchWithRetry = async (url) => {
  return retryPolicy.executeWithRetry(
    () => fetch(url).then(r => {
      if (!r.ok) throw new APIError('Failed', r.status);
      return r.json();
    }),
    { url }
  );
};
```

**🔍 Dry Run Example:**

```
Scenario: Fetching product data with transient 503 errors

Step 1: Initial request (attempt 0)
---------------------------------------------------------
  fn() -> fetch('/product/123')
  Result: 503 Service Unavailable
  isRetryable(error) -> true (503 in retryableErrors)
  attempt (0) < maxRetries (3) -> true, continue
  delay = calculateDelay(0) = 1000ms * 2^0 = 1000ms
  With jitter: 1000 * (0.5 + 0.7) = 1200ms
  Action: Sleep 1200ms, then retry

Step 2: Retry 1 (attempt 1)
---------------------------------------------------------
  fn() -> fetch('/product/123')
  Result: 503 Service Unavailable
  isRetryable(error) -> true
  attempt (1) < maxRetries (3) -> true, continue
  delay = calculateDelay(1) = 1000ms * 2^1 = 2000ms
  With jitter: 2000 * (0.5 + 0.6) = 2200ms
  Action: Sleep 2200ms, then retry

Step 3: Retry 2 (attempt 2)
---------------------------------------------------------
  fn() -> fetch('/product/123')
  Result: 200 OK { id: 123, name: 'Laptop' }
  Action: Return success, log "succeeded after 2 retries"
  Final result: { id: 123, name: 'Laptop' }
```

**Advanced: Circuit Breaker Pattern**

```javascript
// Prevent cascading failures with circuit breaker
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.nextRetry = null;
  }
  
  async execute(fn, context = {}) {
    // Check circuit state
    if (this.state === 'OPEN') {
      // Check if we should try to close the circuit
      if (Date.now() < this.nextRetry) {
        throw new Error('Circuit breaker is OPEN');
      }
      
      // Move to HALF_OPEN state to test
      this.state = 'HALF_OPEN';
      console.log('Circuit breaker entering HALF_OPEN state');
    }
    
    try {
      const result = await fn();
      
      // Success! Reset circuit
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
        console.log('Circuit breaker CLOSED');
      }
      
      return result;
      
    } catch (error) {
      this.failures++;
      
      // Trip circuit breaker if threshold exceeded
      if (this.failures >= this.failureThreshold) {
        this.state = 'OPEN';
        this.nextRetry = Date.now() + this.resetTimeout;
        
        console.error(
          `Circuit breaker OPEN after ${this.failures} failures. ` +
          `Will retry at ${new Date(this.nextRetry).toISOString()}`,
          context
        );
      }
      
      throw error;
    }
  }
}

// Usage
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000,
});

const fetchWithCircuitBreaker = async (url) => {
  return circuitBreaker.execute(
    () => fetch(url).then(r => r.json()),
    { url }
  );
};
```

---

## 4. Real-World Implementation with React Query

**Complete example using React Query for data orchestration:**

```javascript
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configure query client with caching and retry policies
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// API client with observability
const apiClient = new ObservableAPIClient('https://api.example.com', {
  metrics: window.datadog,
  logger: console,
});

// Product page with parallel data fetching
const ProductPage = ({ productId }) => {
  // Fetch product, reviews, and recommendations in parallel
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiClient.request('GET', `/products/${productId}`),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  const reviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => apiClient.request('GET', `/products/${productId}/reviews`),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', productId],
    queryFn: () => apiClient.request('GET', `/recommendations/${productId}`),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Handle loading and error states
  if (productQuery.isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (productQuery.isError) {
    return <ErrorView error={productQuery.error} />;
  }
  
  return (
    <div>
      <ProductDetails product={productQuery.data} />
      
      {/* Show partial data even if some queries fail */}
      {reviewsQuery.isSuccess && (
        <Reviews data={reviewsQuery.data} />
      )}
      
      {recommendationsQuery.isSuccess && (
        <Recommendations data={recommendationsQuery.data} />
      )}
    </div>
  );
};

// Optimistic updates with rollback
const AddToCartButton = ({ productId }) => {
  const queryClient = useQueryClient();
  
  const addToCart = useMutation({
    mutationFn: (productId) => 
      apiClient.request('POST', '/cart', { body: { productId } }),
    
    // Optimistic update
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cart'] });
      
      // Snapshot the previous value
      const previousCart = queryClient.getQueryData(['cart']);
      
      // Optimistically update
      queryClient.setQueryData(['cart'], (old) => ({
        ...old,
        items: [...(old?.items || []), { productId, quantity: 1 }],
      }));
      
      // Return context with previous value
      return { previousCart };
    },
    
    // Rollback on error
    onError: (err, productId, context) => {
      queryClient.setQueryData(['cart'], context.previousCart);
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
  
  return (
    <button onClick={() => addToCart.mutate(productId)}>
      Add to Cart
    </button>
  );
};

// Tag-based cache invalidation
const useInvalidateProductCache = () => {
  const queryClient = useQueryClient();
  
  return (productId) => {
    // Invalidate all queries related to this product
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
    queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    queryClient.invalidateQueries({ queryKey: ['recommendations', productId] });
    
    // Invalidate catalog pages that might contain this product
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
};

// App with React Query provider
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProductPage productId={123} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

---

## 5. Platform Adaptations

### Mobile Web Considerations

```javascript
// Detect slow connections and adjust caching strategy
const useAdaptiveCaching = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  // Adjust cache time based on connection speed
  const getCacheTime = () => {
    
    const effectiveType = connection.effectiveType;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 60 * 60 * 1000; // 1 hour (cache aggressively)
      case '3g':
        return 30 * 60 * 1000; // 30 minutes
      case '4g':
      default:
        return 5 * 60 * 1000; // 5 minutes
    }
  };
  
  return { cacheTime: getCacheTime() };
};
```

### Service Worker Integration

```javascript
// Service worker for offline support
self.addEventListener('fetch', (event) => {
  // Cache-first strategy for static assets
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
  
  // Network-first with fallback for API calls
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(event.request);
        })
    );
  }
});
```

---

## 6. Common Interview Questions

### Q1: How would you handle cache invalidation when data is updated on the server?

**Answer:**
I would use a combination of strategies:

1. **WebSocket notifications:** Subscribe to server-sent events for real-time updates
2. **Tag-based invalidation:** Group related cache entries by tags and invalidate them together
3. **Versioning:** Include version numbers in cache keys (e.g., `product:123:v5`)
4. **Background polling:** Periodic revalidation for critical data with `stale-while-revalidate`

```javascript
// WebSocket-based cache invalidation
const socket = new WebSocket('wss://api.example.com/updates');

socket.addEventListener('message', (event) => {
  const update = JSON.parse(event.data);
  
  switch (update.type) {
    case 'product:updated':
      queryClient.invalidateQueries(['product', update.productId]);
      break;
    case 'cart:modified':
      queryClient.invalidateQueries(['cart', update.userId]);
      break;
  }
});
```

---

### Q2: How do you prevent API waterfalls in a complex UI with nested components?

**Answer:**
I use several techniques:

1. **Parallel fetching:** Use `Promise.all` for independent requests
2. **Data preloading:** Fetch data at the route level before rendering components
3. **Request deduplication:** Prevent duplicate in-flight requests
4. **GraphQL/Data loader:** Batch related requests into a single call

```javascript
// Route-level data preloading
const productLoader = async ({ params }) => {
  // Fetch all data in parallel before rendering
  const [product, reviews, recommendations] = await Promise.all([
    fetchProduct(params.id),
    fetchReviews(params.id),
    fetchRecommendations(params.id),
  ]);
  
  return { product, reviews, recommendations };
};
```

---

### Q3: How would you implement a cache that works across multiple tabs?

**Answer:**
Use **Shared Worker** or **BroadcastChannel API** for cross-tab synchronization:

```javascript
// Broadcast cache updates to all tabs
class CrossTabCache {
  constructor() {
    this.cache = new Map();
    this.channel = new BroadcastChannel('cache-sync');
    
    // Listen for updates from other tabs
    this.channel.addEventListener('message', (event) => {
      const { action, key, data } = event.data;
      
      if (action === 'set') {
        this.cache.set(key, data);
      } else if (action === 'delete') {
        this.cache.delete(key);
      }
    });
  }
  
  set(key, data) {
    this.cache.set(key, data);
    
    // Notify other tabs
    this.channel.postMessage({ action: 'set', key, data });
  }
  
  delete(key) {
    this.cache.delete(key);
    
    // Notify other tabs
    this.channel.postMessage({ action: 'delete', key });
  }
}
```

---

### Q4: How do you handle partial failures when fetching from multiple APIs?

**Answer:**
Use `Promise.allSettled` instead of `Promise.all` to handle partial failures gracefully:

```javascript
const fetchDashboard = async () => {
  const results = await Promise.allSettled([
    fetchUser(),
    fetchCart(),
    fetchRecommendations(),
  ]);
  
  return {
    user: results[0].status === 'fulfilled' ? results[0].value : null,
    cart: results[1].status === 'fulfilled' ? results[1].value : null,
    recommendations: results[2].status === 'fulfilled' ? results[2].value : [],
    errors: results.filter(r => r.status === 'rejected').map(r => r.reason),
  };
};
```

I would also implement **graceful degradation** where the UI shows available data even if some requests fail.

---

### Q5: What's your strategy for cache warming on app startup?

**Answer:**
I prioritize cache warming for critical data:

```javascript
// Preload critical data on app startup
const warmCache = async (userId) => {
  // Critical data (blocking)
  await Promise.all([
    queryClient.prefetchQuery(['user', userId], () => fetchUser(userId)),
    queryClient.prefetchQuery(['cart', userId], () => fetchCart(userId)),
  ]);
  
  // Nice-to-have data (non-blocking)
  Promise.all([
    queryClient.prefetchQuery(['recommendations', userId], () => fetchRecs(userId)),
    queryClient.prefetchQuery(['favorites', userId], () => fetchFavorites(userId)),
  ]).catch(err => console.warn('Background prefetch failed:', err));
};

// Call on app mount
useEffect(() => {
  warmCache(currentUser.id);
}, [currentUser.id]);
```

---

### Q6: How do you measure and optimize cache hit rates?

**Answer:**
Track metrics and adjust TTL based on hit rates:

```javascript
class InstrumentedCache {
  constructor() {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
  }
  
  get(key) {
    if (this.cache.has(key)) {
      this.stats.hits++;
      return this.cache.get(key);
    }
    
    this.stats.misses++;
    return null;
  }
  
  getHitRate() {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : this.stats.hits / total;
  }
  
  reportMetrics() {
    const hitRate = this.getHitRate();
    
    // Send to monitoring
    metrics.gauge('cache.hit_rate', hitRate);
    metrics.gauge('cache.size', this.cache.size);
    
    console.log(`Cache hit rate: ${(hitRate * 100).toFixed(2)}%`);
  }
}
```

Target hit rates:
- **User data:** 80-90% (frequently accessed)
- **Product catalog:** 60-70% (moderate access)
- **Search results:** 40-50% (highly variable)

---

## 7. Common Pitfalls

### ❌ Pitfall 1: Caching Authentication Tokens

**Bad:**
```javascript
// DON'T cache auth tokens in memory
const cache = new Map();
cache.set('auth:token', { token: 'secret-jwt', expiresIn: 3600 });
```

**Why it's bad:** Tokens can leak through XSS attacks, browser extensions, or memory inspection.

**Good:**
```javascript
// ✅ Store tokens in HttpOnly cookies or secure storage
// Server sets: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// Or use Web Crypto API for client-side encryption
const storeTokenSecurely = async (token) => {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Encrypt and store in IndexedDB
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) },
    key,
    new TextEncoder().encode(token)
  );
  
  await indexedDB.put('secure-store', 'token', encrypted);
};
```

---

### ❌ Pitfall 2: Not Handling Race Conditions

**Bad:**
```javascript
// Multiple rapid updates can overwrite each other
const updateProfile = async (userId, data) => {
  const current = await fetchProfile(userId); // Read
  const updated = { ...current, ...data };
  await saveProfile(userId, updated); // Write
  // If another update happens between read and write, data is lost!
};
```

**Good:**
```javascript
// ✅ Use optimistic locking with version numbers
const updateProfile = async (userId, data) => {
  const current = await fetchProfile(userId);
  
  try {
    await saveProfile(userId, {
      ...current,
      ...data,
      version: current.version + 1, // Increment version
    });
  } catch (error) {
    if (error.status === 409) { // Conflict
      // Retry with latest version
      return updateProfile(userId, data);
    }
    throw error;
  }
};
```

---

### ❌ Pitfall 3: Over-caching Dynamic Data

**Bad:**
```javascript
// Caching real-time data like stock prices or live sports scores
const stockPrice = await fetchWithCache('stock:AAPL', fetchStockPrice, {
  ttl: 5 * 60 * 1000, // 5 minutes
});
```

**Why it's bad:** Users see stale prices and make decisions on outdated data.

**Good:**
```javascript
// ✅ Use short TTL and real-time updates for critical data
const stockPrice = await fetchWithCache('stock:AAPL', fetchStockPrice, {
  ttl: 5 * 1000, // 5 seconds max
});

// Plus WebSocket for real-time updates
const socket = new WebSocket('wss://api.example.com/stocks/AAPL');
socket.onmessage = (event) => {
  const { price } = JSON.parse(event.data);
  cache.set('stock:AAPL', { price, timestamp: Date.now() });
};
```

---

### ❌ Pitfall 4: Ignoring Cache Size Limits

**Bad:**
```javascript
// Unbounded cache grows indefinitely
const cache = new Map();
cache.set(key, data); // Keeps adding entries forever
```

**Good:**
```javascript
// ✅ Implement LRU (Least Recently Used) eviction
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}
```

---

## 8. Time & Space Complexity

| Operation | Time Complexity | Space Complexity | Notes |
|-----------|----------------|------------------|-------|
| Cache Get | O(1) | O(1) | Hash map lookup |
| Cache Set | O(1) | O(n) | n = number of cached entries |
| LRU Eviction | O(1) | O(n) | Using doubly-linked list + hash map |
| Tag Invalidation | O(k) | O(m) | k = entries with tag, m = total tags |
| Parallel Fetch (Promise.all) | O(max(t₁, t₂, ..., tₙ)) | O(n) | n = number of requests |
| Sequential Fetch | O(t₁ + t₂ + ... + tₙ) | O(1) | Sum of all request times |
| Circuit Breaker Check | O(1) | O(1) | State machine |
| Exponential Backoff | O(1) | O(1) | Simple calculation |

**Key Insights:**
- **Caching reduces time complexity** from O(API latency) to O(1) for subsequent requests
- **Space complexity grows linearly** with cached data, requiring eviction strategies
- **Parallel fetching** reduces total time to the slowest request, not the sum of all requests

---

## 9. Summary

### Quick Reference Table

| Concern | Strategy | Implementation |
|---------|----------|----------------|
| **Staleness** | TTL + Stale-While-Revalidate | Time-based expiration with background refresh |
| **Invalidation** | Tag-based + Event-driven | Group related entries, subscribe to domain events |
| **Waterfalls** | Parallel fetching + Deduplication | `Promise.all`, request deduplication |
| **Observability** | Structured logging + Metrics | Tracing, error tracking, performance metrics |
| **Retries** | Exponential backoff + Circuit breaker | Retry transient failures, prevent cascading failures |
| **Correctness** | Optimistic updates + Versioning | Immediate UI update with rollback on failure |

### 5 Key Takeaways

1. **Multi-level caching is essential** — Use memory (L1), IndexedDB (L2), and Service Worker (L3) for optimal performance across different scenarios.

2. **Staleness policies must match data characteristics** — Real-time data (cart) needs aggressive invalidation, while static data (product catalog) can be cached longer.

3. **Parallel fetching prevents waterfalls** — Always fetch independent data in parallel using `Promise.all` or `Promise.allSettled` to minimize latency.

4. **Observability is non-negotiable at scale** — Instrument every API call with tracing, logging, and metrics to debug production issues effectively.

5. **Resilience requires retry strategies** — Implement exponential backoff with jitter and circuit breakers to handle transient failures gracefully without overwhelming servers.

---

## 📚 Further Reading

- [React Query Documentation](https://tanstack.com/query/latest) — Comprehensive guide to data fetching and caching in React
- [HTTP Caching (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) — HTTP cache headers and browser caching strategies
- [Designing Data-Intensive Applications](https://dataintensive.net/) — Martin Kleppmann's book on distributed systems and data consistency
