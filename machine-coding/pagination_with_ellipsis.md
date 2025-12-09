# 🔢 React Pagination with Ellipsis

A comprehensive guide to building an intelligent pagination component in React that displays page numbers with ellipsis ("...") for large page ranges.

---

## 💡 What is Pagination with Ellipsis?

Pagination with ellipsis is a UI pattern that shows a subset of page numbers with gaps represented by "..." (ellipsis). This prevents overwhelming users with too many page numbers while still allowing quick navigation to key pages.

### Key Rules:
- **Always visible**: First page, Last page, Current page, Previous page (current - 1), Next page (current + 1)
- **Gaps**: Show '...' when there's a gap between displayed page numbers
- **Smart logic**: Automatically calculates which pages to show based on current position

---

## 🧠 Core Concepts

### Display Logic

The pagination needs to intelligently decide which page numbers to show:

1. **First page** (1) is always shown
2. **Last page** (totalPages) is always shown
3. **Current page** and its neighbors (current - 1, current + 1) are shown
4. **Ellipsis** appears when there's a gap of 2 or more pages

### Visual Examples

```
Total Pages: 10, Current: 1
[1] 2 ... 10

Total Pages: 10, Current: 2
1 [2] 3 ... 10

Total Pages: 10, Current: 5
1 ... 4 [5] 6 ... 10

Total Pages: 10, Current: 9
1 ... 8 [9] 10

Total Pages: 10, Current: 10
1 ... 9 [10]
```

---

## ✅ Implementation

### Complete Pagination Component

```jsx
import React, { useState } from 'react';

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always include first page
    pages.push(1);
    
    // Calculate range around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if there's a gap
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if there's a gap
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always include last page (if more than 1 page exists)
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (page === '...') return; // Ignore ellipsis clicks
    
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{
          padding: '8px 12px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: 'white'
        }}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={page === '...'}
          style={{
            padding: '8px 12px',
            cursor: page === '...' ? 'default' : 'pointer',
            background: page === currentPage ? '#007bff' : 'white',
            color: page === currentPage ? 'white' : 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            minWidth: '40px'
          }}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 12px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: 'white'
        }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
```

---

## 🧪 Usage Examples

### Basic Usage

```jsx
import React, { useState } from 'react';
import Pagination from './Pagination';

const App = () => {
  const [currentData, setCurrentData] = useState([]);
  const totalPages = 15;

  const handlePageChange = (page) => {
    console.log(`Navigated to page ${page}`);
    // Fetch data for the selected page
    // fetchDataForPage(page);
  };

  return (
    <div>
      <h1>My Content</h1>
      <Pagination 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};
```

### With Data Fetching

```jsx
import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

const DataList = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page) => {
    try {
      const response = await fetch(`/api/items?page=${page}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      setItems(data.items);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div>
        {items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
      
      <Pagination 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};
```

### Controlled Component with External State

```jsx
import React, { useState } from 'react';

const PaginationControlled = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);
    
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (startPage > 2) pages.push('...');
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (endPage < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      
      {getPageNumbers().map((page, idx) => (
        <button
          key={idx}
          onClick={() => page !== '...' && onPageChange(page)}
          disabled={page === '...'}
          style={{
            background: page === currentPage ? '#007bff' : 'white',
            color: page === currentPage ? 'white' : 'black'
          }}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

// Usage
const App = () => {
  const [page, setPage] = useState(1);
  
  return (
    <PaginationControlled 
      currentPage={page}
      totalPages={20}
      onPageChange={setPage}
    />
  );
};
```

---

## 🔧 Advanced Features

### With Jump to Page Input

```jsx
const PaginationWithJump = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpValue, setJumpValue] = useState('');

  const handleJump = () => {
    const pageNum = parseInt(jumpValue, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      onPageChange?.(pageNum);
      setJumpValue('');
    }
  };

  // ... rest of pagination logic

  return (
    <div>
      {/* Regular pagination buttons */}
      
      <div style={{ marginLeft: '20px', display: 'inline-flex', gap: '8px' }}>
        <input
          type="number"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder="Go to"
          min="1"
          max={totalPages}
          style={{ width: '60px', padding: '8px' }}
        />
        <button onClick={handleJump}>Jump</button>
      </div>
    </div>
  );
};
```

### With Page Size Selector

```jsx
const PaginationWithPageSize = ({ totalItems, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
    onPageChange?.(1, newSize);
  };

  return (
    <div>
      {/* Pagination component */}
      
      <select 
        value={pageSize} 
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        style={{ marginLeft: '20px', padding: '8px' }}
      >
        <option value="10">10 per page</option>
        <option value="25">25 per page</option>
        <option value="50">50 per page</option>
        <option value="100">100 per page</option>
      </select>
    </div>
  );
};
```

---

## ⚠️ Edge Cases & Considerations

### Edge Case 1: Single Page
When `totalPages = 1`, only one button should be shown (no pagination needed).

```jsx
if (totalPages <= 1) {
  return null; // Or show disabled pagination
}
```

### Edge Case 2: Two to Three Pages
With very few pages, no ellipsis is needed:

```
Pages: 2, Current: 1 → [1] 2
Pages: 3, Current: 2 → 1 [2] 3
```

### Edge Case 3: Current Page at Boundaries
- When at page 1: No previous page shown
- When at last page: No next page shown

### Performance Considerations

1. **Memoization**: Use `useMemo` for `getPageNumbers()` to avoid recalculating on every render:

```jsx
const pageNumbers = useMemo(() => getPageNumbers(), [currentPage, totalPages]);
```

2. **Debouncing**: If pagination triggers API calls, debounce rapid page changes:

```jsx
const debouncedPageChange = useMemo(
  () => debounce((page) => onPageChange(page), 300),
  [onPageChange]
);
```

3. **Virtual Scrolling**: For extremely large datasets (1000+ pages), consider infinite scroll or virtual scrolling instead.

---

## 🎯 Best Practices

### 1. **Accessibility**
```jsx
<button
  aria-label={`Go to page ${page}`}
  aria-current={page === currentPage ? 'page' : undefined}
>
  {page}
</button>
```

### 2. **Loading States**
```jsx
const [isLoading, setIsLoading] = useState(false);

const handlePageChange = async (page) => {
  setIsLoading(true);
  await fetchData(page);
  setIsLoading(false);
};

// Disable pagination while loading
<button disabled={isLoading || currentPage === 1}>
  Previous
</button>
```

### 3. **URL Synchronization**
```jsx
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  // ... rest of component
};
```

---

## 📊 Algorithm Breakdown

### Step-by-Step Page Number Generation

```javascript
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  
  // Step 1: Always add first page
  pages.push(1);
  
  // Step 2: Calculate visible range around current page
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
  
  // Step 3: Add left ellipsis if gap exists
  if (startPage > 2) {
    pages.push('...');
  }
  
  // Step 4: Add pages in visible range
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Step 5: Add right ellipsis if gap exists
  if (endPage < totalPages - 1) {
    pages.push('...');
  }
  
  // Step 6: Always add last page (if totalPages > 1)
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  return pages;
};

// Example outputs:
console.log(getPageNumbers(1, 10));  // [1, 2, '...', 10]
console.log(getPageNumbers(5, 10));  // [1, '...', 4, 5, 6, '...', 10]
console.log(getPageNumbers(9, 10));  // [1, '...', 8, 9, 10]
```

---

## 🔍 Summary

- ✅ **Core pages** (first, last, current, neighbors) are always visible
- ✅ **Ellipsis** indicates gaps to reduce visual clutter
- ✅ **Smart logic** adapts display based on current position
- ✅ **React hooks** for state management (useState, useEffect)
- ✅ **Accessibility** with ARIA labels and keyboard navigation
- ✅ **Performance** optimized with memoization
- ✅ **Flexible** supports controlled/uncontrolled patterns

### Key Takeaways

1. The algorithm ensures important pages are always visible
2. Ellipsis appears when gaps are 2+ pages
3. Component can be controlled or uncontrolled
4. Consider accessibility and loading states
5. Optimize with memoization for large page counts
6. Sync with URL for shareable/bookmarkable pages

---

## 🌐 Related Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [Accessibility in Pagination](https://www.w3.org/WAI/ARIA/apg/patterns/pagination/)
- [URL State Management](https://reactrouter.com/en/main/hooks/use-search-params)

---

**Last Updated**: December 2024
