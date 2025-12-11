# 🗺️ System Design: Google Maps (Frontend Interview Guide)

**Target Level:** Senior Frontend Engineer / Staff Engineer
**Duration:** 45-60 minutes
**Interview Focus:** Frontend Architecture, Performance, State Management, Rendering

---

## Interview Approach & What Interviewers Look For

When asked to design Google Maps in a frontend interview, interviewers are evaluating:

1. **Architecture Thinking:** Can you break down a complex UI into manageable components?
2. **Performance Awareness:** Do you understand rendering bottlenecks and optimization strategies?
3. **Trade-off Analysis:** Can you articulate why you chose one approach over another?
4. **Real-world Experience:** Have you dealt with similar challenges (canvas rendering, large datasets, real-time updates)?
5. **Scalability:** Can your design handle millions of data points without crashing?

**Pro Tip:** Start with clarifying questions, then move from high-level architecture to specific technical deep dives.

---

## 1. Clarifying Questions (First 5 minutes)

Before diving in, ask these questions to scope the problem:

**Functional Scope:**
- "Should we support just viewing maps, or also search, directions, and real-time traffic?"
- "Do we need offline support?"
- "What platforms? Web only, or also mobile web?"

**Non-Functional Requirements:**
- "What's the expected scale? Millions of concurrent users?"
- "Performance targets? Should we maintain 60fps during pan/zoom?"
- "Accessibility requirements? WCAG compliance?"

**Technical Constraints:**
- "Can we use existing libraries like Mapbox GL or Leaflet, or build from scratch?"
- "Browser support? Modern browsers only, or legacy IE11?"

---

## 2. High-Level Architecture (Draw This!)

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │           UI Layer (React/DOM)                     │ │
│  │  • Search Bar  • Zoom Controls  • Info Windows    │ │
│  └────────────────────────────────────────────────────┘ │
│                         ↕                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │        State Management (Zustand/Redux)            │ │
│  │  • Camera Position  • Search Results  • Routes    │ │
│  └────────────────────────────────────────────────────┘ │
│                         ↕                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Rendering Engine (WebGL/Canvas)            │ │
│  │  • Map Tiles  • Markers  • 3D Buildings           │ │
│  └────────────────────────────────────────────────────┘ │
│                         ↕                                │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Data Layer                            │ │
│  │  • Tile Cache (IndexedDB)  • Web Workers          │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↕
              ┌──────────────────────┐
              │   Backend Services   │
              │  • Tile API          │
              │  • Geocoding API     │
              │  • Directions API    │
              └──────────────────────┘
```

**Key Talking Points:**
- **Separation of Concerns:** UI, State, Rendering, and Data are decoupled
- **Hybrid Rendering:** DOM for UI controls, Canvas/WebGL for map
- **Client-Heavy:** Most rendering happens in the browser for performance

---

## 3. Core Technical Decisions

### 3.1 Why Canvas/WebGL Instead of DOM?

**Interview Answer:**
> "For Google Maps, we need to render thousands of vector shapes (roads, buildings, labels). If we used DOM elements (SVG or HTML), we'd create thousands of nodes, which would:
> 1. **Consume excessive memory** (each DOM node has overhead)
> 2. **Cause layout thrashing** during pan/zoom (browser recalculates positions)
> 3. **Drop frames** below 60fps
>
> Canvas/WebGL renders everything as pixels on a single element, leveraging GPU acceleration. The trade-off is we lose native accessibility and event handling, which we'll need to implement manually."

**Follow-up Question:** "How would you handle click events on markers?"
**Answer:** "We'd implement **raycasting** - convert screen coordinates to world coordinates and check which marker's bounding box contains the click point."

### 3.2 Tiling Strategy

**Interview Answer:**
> "We can't load the entire world at once. We use a **QuadTree tiling system**:
> - At zoom level 0: 1 tile (whole world, 256×256px)
> - At zoom level 1: 4 tiles (2×2 grid)
> - At zoom level N: 4^N tiles
>
> Each tile has coordinates (x, y, z) where z is zoom level. When the user pans, we:
> 1. Calculate viewport bounds (lat/lng)
> 2. Convert to tile coordinates at current zoom
> 3. Request only visible tiles from CDN
> 4. Cache tiles in memory (LRU) and IndexedDB for offline"

**Code Example:**
```javascript
function getTilesForViewport(bounds, zoom) {
  const tileSize = 256;
  const scale = Math.pow(2, zoom);
  
  // Convert lat/lng to tile coordinates
  const minTileX = Math.floor(lngToTileX(bounds.west, zoom));
  const maxTileX = Math.floor(lngToTileX(bounds.east, zoom));
  const minTileY = Math.floor(latToTileY(bounds.north, zoom));
  const maxTileY = Math.floor(latToTileY(bounds.south, zoom));
  
  const tiles = [];
  for (let x = minTileX; x <= maxTileX; x++) {
    for (let y = minTileY; y <= maxTileY; y++) {
      tiles.push({ x, y, z: zoom });
    }
  }
  return tiles;
}

function lngToTileX(lng, zoom) {
  return ((lng + 180) / 360) * Math.pow(2, zoom);
}

function latToTileY(lat, zoom) {
  const latRad = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom);
}
```

### 3.3 Vector Tiles vs Raster Tiles

**Interview Answer:**
> "Modern maps use **Vector Tiles** (Protocol Buffers) instead of raster images because:
> 
> **Vector Tiles:**
> - ✅ 70% smaller file size (binary format)
> - ✅ Client-side styling (dark mode without re-downloading)
> - ✅ Crisp at any zoom level (mathematical paths)
> - ✅ Rotation support (labels stay upright)
> - ❌ Requires client-side rendering (CPU/GPU cost)
>
> **Raster Tiles:**
> - ✅ Simple to render (just display image)
> - ❌ Large file size (PNG/JPG)
> - ❌ Pixelated when zoomed
> - ❌ Can't change colors without server re-render
>
> For satellite imagery, we'd still use raster. For street maps, vector is superior."

---

## 4. State Management Architecture

### 4.1 State Structure

**Interview Answer:**
> "I'd organize state into distinct layers with clear ownership:"

```javascript
// Using Zustand for this example
import create from 'zustand';

const useMapStore = create((set, get) => ({
  // 1. Camera State (URL-synced for deep linking)
  camera: {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
    bearing: 0,  // rotation
    pitch: 0     // tilt for 3D
  },
  
  // 2. Interaction State (ephemeral, not persisted)
  interaction: {
    isDragging: false,
    isZooming: false,
    cursor: 'grab'
  },
  
  // 3. Data State (cached)
  tiles: new Map(),        // key: "z/x/y" -> TileData
  markers: [],
  searchResults: [],
  activeRoute: null,
  
  // 4. UI State
  ui: {
    sidebarOpen: false,
    selectedPlace: null,
    layers: {
      traffic: false,
      transit: false,
      satellite: false
    }
  },
  
  // Actions
  setCamera: (camera) => set({ camera }),
  
  panTo: (center, options = {}) => {
    const { animate = true } = options;
    if (animate) {
      // Trigger animation (handled by rendering engine)
      animateCamera(get().camera.center, center);
    }
    set({ camera: { ...get().camera, center } });
  },
  
  addTile: (key, data) => {
    set(state => ({
      tiles: new Map(state.tiles).set(key, data)
    }));
  }
}));
```

### 4.2 URL Synchronization

**Interview Answer:**
> "The URL should be the source of truth for shareable state (camera position). I'd implement throttled URL updates to avoid polluting browser history:"

```javascript
import { throttle } from 'lodash';

// Subscribe to camera changes
useMapStore.subscribe(
  state => state.camera,
  throttle((camera) => {
    const url = `/@${camera.center.lat.toFixed(6)},${camera.center.lng.toFixed(6)},${camera.zoom}z`;
    window.history.replaceState(null, '', url);
  }, 500) // Update URL max once per 500ms
);

// On initial load, parse URL
function parseCameraFromURL() {
  const match = window.location.pathname.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+)z/);
  if (match) {
    return {
      center: { lat: parseFloat(match[1]), lng: parseFloat(match[2]) },
      zoom: parseInt(match[3])
    };
  }
  return null; // Use default
}
```

---

## 5. Performance Optimization Strategies

### 5.1 Web Workers for Tile Processing

**Interview Answer:**
> "Parsing binary vector tiles (Protocol Buffers) is CPU-intensive. If done on the main thread, it blocks rendering and causes jank. I'd use a **Worker Pool**:"

```javascript
// main.js
class TileWorkerPool {
  constructor(size = 4) {
    this.workers = Array.from({ length: size }, () => 
      new Worker('/tile-worker.js')
    );
    this.nextWorker = 0;
    this.pending = new Map(); // requestId -> { resolve, reject }
  }
  
  async parseTile(tileBuffer, tileKey) {
    const worker = this.workers[this.nextWorker];
    this.nextWorker = (this.nextWorker + 1) % this.workers.length;
    
    const requestId = Math.random().toString(36);
    
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, { resolve, reject });
      
      worker.postMessage({
        type: 'PARSE_TILE',
        requestId,
        tileKey,
        buffer: tileBuffer
      }, [tileBuffer]); // Transfer ownership (zero-copy)
      
      worker.onmessage = (e) => {
        const { requestId, result, error } = e.data;
        const pending = this.pending.get(requestId);
        
        if (error) {
          pending.reject(error);
        } else {
          pending.resolve(result);
        }
        this.pending.delete(requestId);
      };
    });
  }
}

// tile-worker.js
self.onmessage = async (e) => {
  const { type, requestId, tileKey, buffer } = e.data;
  
  if (type === 'PARSE_TILE') {
    try {
      // 1. Decode Protobuf
      const tile = decodePBF(buffer);
      
      // 2. Tessellate polygons (convert to triangles for WebGL)
      const geometry = tessellate(tile);
      
      // 3. Return as transferable
      self.postMessage({
        requestId,
        result: { tileKey, geometry }
      }, [geometry.buffer]);
    } catch (error) {
      self.postMessage({ requestId, error: error.message });
    }
  }
};
```

### 5.2 Debouncing & Throttling

**Interview Question:** "When would you use debounce vs throttle?"

**Answer:**
> "**Debounce** delays execution until after a quiet period. Use for:
> - Search input (wait until user stops typing)
> - Window resize (wait until user finishes resizing)
>
> **Throttle** limits execution frequency. Use for:
> - Scroll events (execute at most once per 100ms)
> - Map pan events (update markers at most 60fps)
> - Analytics tracking"

```javascript
// Debounce implementation
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle implementation
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage
const searchInput = document.getElementById('search');

// Debounce: Only search after user stops typing for 300ms
searchInput.addEventListener('input', debounce((e) => {
  geocodeSearch(e.target.value);
}, 300));

// Throttle: Update visible markers at most once per 100ms during pan
map.on('move', throttle(() => {
  updateVisibleMarkers();
}, 100));
```

### 5.3 Memory Management (LRU Cache)

**Interview Answer:**
> "We can't keep all tiles in memory forever. I'd implement an **LRU (Least Recently Used) cache** with a size limit:"

```javascript
class LRUCache {
  constructor(maxSize = 256) {
    this.cache = new Map();
    this.maxSize = maxSize;
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
    // Remove if exists (to re-insert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      const evicted = this.cache.get(firstKey);
      
      // Clean up GPU resources
      if (evicted.texture) {
        evicted.texture.delete();
      }
      
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  clear() {
    // Clean up all GPU resources
    for (const tile of this.cache.values()) {
      if (tile.texture) {
        tile.texture.delete();
      }
    }
    this.cache.clear();
  }
}

// Usage
const tileCache = new LRUCache(256);

async function loadTile(x, y, z) {
  const key = `${z}/${x}/${y}`;
  
  // Check cache first
  let tile = tileCache.get(key);
  if (tile) return tile;
  
  // Fetch from network
  const response = await fetch(`/tiles/${key}.pbf`);
  const buffer = await response.arrayBuffer();
  
  // Parse in worker
  const parsed = await workerPool.parseTile(buffer, key);
  
  // Upload to GPU
  const texture = uploadToGPU(parsed.geometry);
  
  // Cache it
  tile = { geometry: parsed.geometry, texture };
  tileCache.set(key, tile);
  
  return tile;
}
```

---

## 6. Event Handling & Gestures

### 6.1 Unified Pointer Events

**Interview Answer:**
> "Modern devices have mouse, touch, and pen input. Instead of handling each separately, I'd use the **Pointer Events API** for unified handling:"

```javascript
class MapGestureHandler {
  constructor(canvas, onPan, onZoom) {
    this.canvas = canvas;
    this.onPan = onPan;
    this.onZoom = onZoom;
    
    this.pointers = new Map(); // pointerId -> { x, y }
    this.lastPinchDistance = null;
    
    canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
    canvas.addEventListener('pointercancel', this.handlePointerUp.bind(this));
    
    // Prevent default touch behaviors
    canvas.addEventListener('touchstart', (e) => e.preventDefault());
  }
  
  handlePointerDown(e) {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.canvas.setPointerCapture(e.pointerId);
    
    if (this.pointers.size === 2) {
      // Start pinch gesture
      const points = Array.from(this.pointers.values());
      this.lastPinchDistance = this.getDistance(points[0], points[1]);
    }
  }
  
  handlePointerMove(e) {
    if (!this.pointers.has(e.pointerId)) return;
    
    const oldPos = this.pointers.get(e.pointerId);
    const newPos = { x: e.clientX, y: e.clientY };
    this.pointers.set(e.pointerId, newPos);
    
    if (this.pointers.size === 1) {
      // Single pointer = Pan
      const dx = newPos.x - oldPos.x;
      const dy = newPos.y - oldPos.y;
      this.onPan(dx, dy);
      
    } else if (this.pointers.size === 2) {
      // Two pointers = Pinch zoom
      const points = Array.from(this.pointers.values());
      const distance = this.getDistance(points[0], points[1]);
      
      if (this.lastPinchDistance) {
        const scale = distance / this.lastPinchDistance;
        const center = this.getCenter(points);
        this.onZoom(scale, center);
      }
      
      this.lastPinchDistance = distance;
    }
  }
  
  handlePointerUp(e) {
    this.pointers.delete(e.pointerId);
    this.canvas.releasePointerCapture(e.pointerId);
    
    if (this.pointers.size < 2) {
      this.lastPinchDistance = null;
    }
  }
  
  getDistance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  getCenter(points) {
    const sum = points.reduce((acc, p) => ({ 
      x: acc.x + p.x, 
      y: acc.y + p.y 
    }), { x: 0, y: 0 });
    return { 
      x: sum.x / points.length, 
      y: sum.y / points.length 
    };
  }
}

// Usage
const gestureHandler = new MapGestureHandler(
  canvas,
  (dx, dy) => {
    // Pan the map
    map.panBy(dx, dy);
  },
  (scale, center) => {
    // Zoom toward center point
    map.zoomBy(Math.log2(scale), center);
  }
);
```

### 6.2 Momentum Scrolling (Inertia)

**Interview Answer:**
> "When users swipe and release, the map should continue moving with deceleration, like iOS scrolling. I'd track velocity during drag and animate after release:"

```javascript
class InertiaHandler {
  constructor(onUpdate) {
    this.velocity = { x: 0, y: 0 };
    this.lastPos = null;
    this.lastTime = null;
    this.onUpdate = onUpdate;
    this.animationId = null;
  }
  
  onDragMove(x, y) {
    const now = performance.now();
    
    if (this.lastPos && this.lastTime) {
      const dt = now - this.lastTime;
      // Calculate velocity (pixels per millisecond)
      this.velocity = {
        x: (x - this.lastPos.x) / dt,
        y: (y - this.lastPos.y) / dt
      };
    }
    
    this.lastPos = { x, y };
    this.lastTime = now;
  }
  
  onDragEnd() {
    this.lastPos = null;
    this.lastTime = null;
    this.startInertia();
  }
  
  startInertia() {
    const friction = 0.92; // Deceleration factor (0-1)
    const threshold = 0.01; // Stop when velocity is very small
    
    const animate = () => {
      // Apply friction
      this.velocity.x *= friction;
      this.velocity.y *= friction;
      
      // Continue if velocity is significant
      if (Math.abs(this.velocity.x) > threshold || 
          Math.abs(this.velocity.y) > threshold) {
        
        // Update position
        this.onUpdate(this.velocity.x * 16, this.velocity.y * 16); // Scale to ~60fps
        
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.velocity = { x: 0, y: 0 };
      }
    };
    
    animate();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.velocity = { x: 0, y: 0 };
  }
}
```

---

## 7. Search & Autocomplete

### 7.1 Debounced Search with Request Cancellation

**Interview Answer:**
> "For search autocomplete, we need to:
> 1. Debounce input (don't search on every keystroke)
> 2. Cancel in-flight requests when new input arrives
> 3. Cache results to avoid redundant API calls"

```javascript
class SearchManager {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
    this.abortController = null;
    this.cache = new Map();
  }
  
  async search(query) {
    // Cancel previous request
    if (this.abortController) {
      this.abortController.abort();
    }
    
    // Check cache
    if (this.cache.has(query)) {
      return this.cache.get(query);
    }
    
    // Create new abort controller
    this.abortController = new AbortController();
    
    try {
      const response = await fetch(
        `${this.apiEndpoint}?q=${encodeURIComponent(query)}`,
        { signal: this.abortController.signal }
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const results = await response.json();
      
      // Cache results
      this.cache.set(query, results);
      
      return results;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Search cancelled');
        return null;
      }
      throw error;
    } finally {
      this.abortController = null;
    }
  }
}

// React Component
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchManager = useRef(new SearchManager('/api/geocode'));
  
  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery) => {
      if (searchQuery.length < 3) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const data = await searchManager.current.search(searchQuery);
        if (data) setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return (
    <div className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for places..."
      />
      {loading && <div className="spinner">Loading...</div>}
      <ul className="results">
        {results.map((result) => (
          <li key={result.id} onClick={() => handleSelectPlace(result)}>
            <strong>{result.name}</strong>
            <span>{result.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 8. Offline Support & Caching

### 8.1 Service Worker Strategy

**Interview Answer:**
> "For offline maps, we need a multi-tier caching strategy:
> 1. **Memory Cache (LRU):** Fast access for recently viewed tiles
> 2. **IndexedDB:** Persistent storage for downloaded areas
> 3. **Service Worker:** Intercepts network requests and serves from cache"

```javascript
// service-worker.js
const CACHE_NAME = 'maps-v1';
const TILE_CACHE = 'tiles-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/app.js',
        '/styles.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle tile requests specially
  if (url.pathname.startsWith('/tiles/')) {
    event.respondWith(handleTileRequest(event.request));
  } else {
    // Standard cache-first strategy for app assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

async function handleTileRequest(request) {
  const cache = await caches.open(TILE_CACHE);
  
  // Try cache first
  const cached = await cache.match(request);
  if (cached) return cached;
  
  // If online, fetch and cache
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Offline and not cached - return placeholder
    return new Response('Tile not available offline', { status: 404 });
  }
}
```

### 8.2 Download Area for Offline

```javascript
class OfflineMapManager {
  constructor() {
    this.db = null;
  }
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MapTiles', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('tiles')) {
          db.createObjectStore('tiles', { keyPath: 'key' });
        }
      };
    });
  }
  
  async downloadArea(bounds, minZoom, maxZoom, onProgress) {
    const tiles = [];
    
    // Calculate all tiles needed
    for (let z = minZoom; z <= maxZoom; z++) {
      const tilesAtZoom = getTilesForViewport(bounds, z);
      tiles.push(...tilesAtZoom.map(t => ({ ...t, z })));
    }
    
    let downloaded = 0;
    const total = tiles.length;
    
    // Download in batches to avoid overwhelming the browser
    const batchSize = 10;
    for (let i = 0; i < tiles.length; i += batchSize) {
      const batch = tiles.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (tile) => {
        const key = `${tile.z}/${tile.x}/${tile.y}`;
        
        try {
          const response = await fetch(`/tiles/${key}.pbf`);
          const buffer = await response.arrayBuffer();
          
          // Store in IndexedDB
          await this.storeTile(key, buffer);
          
          downloaded++;
          onProgress(downloaded, total);
        } catch (error) {
          console.error(`Failed to download tile ${key}:`, error);
        }
      }));
    }
  }
  
  async storeTile(key, buffer) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tiles'], 'readwrite');
      const store = transaction.objectStore('tiles');
      
      const request = store.put({ key, data: buffer });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async getTile(key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tiles'], 'readonly');
      const store = transaction.objectStore('tiles');
      
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
}
```

---

## 9. Accessibility (A11y)

**Interview Question:** "How do you make a Canvas-based map accessible?"

**Answer:**
> "Canvas is a 'black box' to screen readers. We need to create a parallel accessible structure:
> 
> 1. **Shadow DOM:** Maintain hidden focusable elements for each interactive map feature
> 2. **ARIA Live Regions:** Announce map state changes
> 3. **Keyboard Navigation:** Arrow keys to pan, +/- to zoom
> 4. **Focus Management:** Sync visual focus ring on canvas with DOM focus"

```javascript
class AccessibilityLayer {
  constructor(mapContainer) {
    this.container = mapContainer;
    this.a11yContainer = document.createElement('div');
    this.a11yContainer.className = 'map-a11y';
    this.a11yContainer.setAttribute('role', 'application');
    this.a11yContainer.setAttribute('aria-label', 'Interactive map');
    
    // Live region for announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only'; // Visually hidden
    
    this.container.appendChild(this.a11yContainer);
    this.container.appendChild(this.liveRegion);
    
    this.setupKeyboardNav();
  }
  
  setupKeyboardNav() {
    this.a11yContainer.tabIndex = 0;
    
    this.a11yContainer.addEventListener('keydown', (e) => {
      const panAmount = 50; // pixels
      
      switch(e.key) {
        case 'ArrowUp':
          map.panBy(0, -panAmount);
          this.announce('Map panned north');
          e.preventDefault();
          break;
        case 'ArrowDown':
          map.panBy(0, panAmount);
          this.announce('Map panned south');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          map.panBy(-panAmount, 0);
          this.announce('Map panned west');
          e.preventDefault();
          break;
        case 'ArrowRight':
          map.panBy(panAmount, 0);
          this.announce('Map panned east');
          e.preventDefault();
          break;
        case '+':
        case '=':
          map.zoomIn();
          this.announce(`Zoomed in to level ${map.getZoom()}`);
          e.preventDefault();
          break;
        case '-':
          map.zoomOut();
          this.announce(`Zoomed out to level ${map.getZoom()}`);
          e.preventDefault();
          break;
      }
    });
  }
  
  announce(message) {
    this.liveRegion.textContent = message;
  }
  
  addMarker(marker) {
    const button = document.createElement('button');
    button.textContent = marker.label;
    button.setAttribute('aria-label', `${marker.label}, ${marker.category}`);
    
    button.addEventListener('click', () => {
      map.flyTo(marker.position);
      this.announce(`Navigated to ${marker.label}`);
    });
    
    button.addEventListener('focus', () => {
      // Draw focus ring on canvas at marker position
      drawFocusRing(marker.position);
    });
    
    this.a11yContainer.appendChild(button);
  }
}
```

---

## 10. Performance Monitoring

**Interview Answer:**
> "For a production map, we need to monitor:
> 1. **Frame rate (FPS):** Should stay at 60fps
> 2. **Tile load times:** P99 should be < 200ms
> 3. **Memory usage:** Detect leaks
> 4. **User interactions:** Track dropped frames during gestures"

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTimes: [],
      tileLoadTimes: [],
      droppedFrames: 0
    };
    
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();
  }
  
  recordFrame() {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    
    this.metrics.frameTimes.push(frameTime);
    
    // Keep only last 60 frames
    if (this.metrics.frameTimes.length > 60) {
      this.metrics.frameTimes.shift();
    }
    
    // Detect dropped frames (> 33ms = < 30fps)
    if (frameTime > 33) {
      this.metrics.droppedFrames++;
      console.warn(`Dropped frame: ${frameTime.toFixed(2)}ms`);
    }
    
    // Update FPS counter every second
    this.frameCount++;
    if (now - this.lastFPSUpdate >= 1000) {
      this.metrics.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFPSUpdate = now;
      
      // Report to analytics
      this.reportMetrics();
    }
    
    this.lastFrameTime = now;
  }
  
  recordTileLoad(duration) {
    this.metrics.tileLoadTimes.push(duration);
    
    // Calculate P99
    if (this.metrics.tileLoadTimes.length >= 100) {
      const sorted = [...this.metrics.tileLoadTimes].sort((a, b) => a - b);
      const p99Index = Math.floor(sorted.length * 0.99);
      const p99 = sorted[p99Index];
      
      if (p99 > 200) {
        console.warn(`Tile load P99 exceeded target: ${p99.toFixed(2)}ms`);
      }
    }
  }
  
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
      };
    }
    return null;
  }
  
  reportMetrics() {
    const avgFrameTime = this.metrics.frameTimes.reduce((a, b) => a + b, 0) / 
                         this.metrics.frameTimes.length;
    
    console.log('Performance Metrics:', {
      fps: this.metrics.fps,
      avgFrameTime: avgFrameTime.toFixed(2) + 'ms',
      droppedFrames: this.metrics.droppedFrames,
      memory: this.getMemoryUsage()
    });
    
    // Send to analytics service
    // analytics.track('map_performance', this.metrics);
  }
}

// Usage in render loop
const perfMonitor = new PerformanceMonitor();

function renderLoop() {
  perfMonitor.recordFrame();
  
  // Render map
  renderMap();
  
  requestAnimationFrame(renderLoop);
}
```

---

## 11. Common Interview Follow-ups

### Q: "How would you handle real-time traffic updates?"

**Answer:**
> "I'd use Server-Sent Events (SSE) or WebSockets for real-time data:
> 
> 1. **Subscribe to viewport:** Send current bounds to server
> 2. **Receive updates:** Server streams traffic data for that area
> 3. **Render as overlay:** Draw colored segments on roads
> 4. **Throttle updates:** Don't re-render more than once per second
> 5. **Unsubscribe on pan:** When user moves to new area, close old stream and open new one"

```javascript
class TrafficLayer {
  constructor(map) {
    this.map = map;
    this.eventSource = null;
    this.trafficData = new Map();
  }
  
  enable() {
    const bounds = this.map.getBounds();
    const url = `/api/traffic/stream?` + 
                `north=${bounds.north}&south=${bounds.south}&` +
                `east=${bounds.east}&west=${bounds.west}`;
    
    this.eventSource = new EventSource(url);
    
    this.eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      // Update traffic data
      update.segments.forEach(segment => {
        this.trafficData.set(segment.id, segment);
      });
      
      // Trigger re-render (throttled)
      this.scheduleRender();
    };
    
    this.eventSource.onerror = () => {
      console.error('Traffic stream error');
      this.disable();
    };
  }
  
  disable() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.trafficData.clear();
  }
  
  scheduleRender = throttle(() => {
    this.map.renderTrafficLayer(this.trafficData);
  }, 1000);
}
```

### Q: "How would you optimize for low-end mobile devices?"

**Answer:**
> "Several strategies:
> 
> 1. **Feature detection:** Check GPU capabilities, reduce quality if needed
> 2. **Adaptive tile resolution:** Load 256px tiles instead of 512px on slow devices
> 3. **Reduce draw calls:** Merge geometries, use instancing
> 4. **Limit concurrent requests:** Reduce worker pool size
> 5. **Disable expensive features:** Turn off 3D buildings, shadows
> 6. **Use requestIdleCallback:** Do non-critical work when browser is idle"

### Q: "How do you handle coordinate precision issues?"

**Answer:**
> "At high zoom levels, floating-point precision errors cause 'jittering'. Solutions:
> 
> 1. **Relative to Center (RTC):** Store coordinates relative to viewport center, not world origin
> 2. **Double precision emulation:** Use two float32s to represent one float64 in shaders
> 3. **Tile-local coordinates:** Keep coordinates within tile bounds (0-4096), not world space"

---

## 12. Key Takeaways for Interview

**What to emphasize:**
1. ✅ **Trade-offs:** Always explain why you chose one approach over another
2. ✅ **Performance:** Show you understand 60fps budget, memory constraints
3. ✅ **Scalability:** Demonstrate thinking about millions of data points
4. ✅ **User Experience:** Mention accessibility, offline support, smooth interactions
5. ✅ **Real-world experience:** Reference actual libraries (Mapbox GL, Leaflet) if you've used them

**What to avoid:**
1. ❌ Jumping straight to implementation without clarifying requirements
2. ❌ Ignoring performance implications
3. ❌ Forgetting about mobile/touch support
4. ❌ Not mentioning accessibility
5. ❌ Over-engineering (don't build everything from scratch if libraries exist)

**Sample closing statement:**
> "To summarize, I'd build a hybrid architecture with WebGL for rendering, Zustand for state management, Web Workers for heavy processing, and a multi-tier caching strategy for offline support. The key challenges are maintaining 60fps performance, managing memory efficiently, and ensuring accessibility despite using Canvas. I'd use existing libraries like Mapbox GL as a foundation rather than building from scratch, focusing on the unique business requirements."

