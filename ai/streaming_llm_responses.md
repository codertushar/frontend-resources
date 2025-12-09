# Handling Streaming LLM Responses in React

When building AI-powered interfaces, one of the most critical UX patterns is **streaming**. Large Language Models (LLMs) can take seconds or even minutes to generate a full response. Waiting for the entire response before showing anything leads to a poor user experience (perceived latency).

Streaming allows us to display text as it arrives, chunk by chunk, giving the user immediate feedback.

## The Technical Challenge

Standard HTTP requests usually wait for the full response. To handle streams in JavaScript, we utilize the [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), specifically `ReadableStream`.

In a React application, we need to:
1.  Initiate the fetch request.
2.  Get the `response.body` reader.
3.  Decode the binary chunks (Uint8Array) into text.
4.  Update the UI state incrementally without triggering excessive re-renders.

## Implementation Guide

Here is a robust hook `useLLMStream` that handles streaming, decoding, and error management.

### 1. The Custom Hook

```javascript
import { useState, useCallback } from 'react';

export function useLLMStream() {
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const streamResponse = useCallback(async (prompt) => {
    setIsLoading(true);
    setError(null);
    setData('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Network error');

      // This is the key: getting the reader
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode the chunk (Uint8Array -> String)
        const chunk = decoder.decode(value, { stream: true });
        
        // Update state functionally to avoid dependency issues
        setData((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, streamResponse };
}
```

### 2. Rendering the Stream

When rendering markdown content that is streaming in, there's a catch: incomplete markdown syntax (like an unclosed bold tag `**bold`) can break rendering libraries.

To solve this, use a robust markdown renderer like `react-markdown` which handles partial content gracefully, or implement a "blinking cursor" effect to indicate activity.

```jsx
import ReactMarkdown from 'react-markdown';

function ChatMessage({ content, isStreaming }) {
  return (
    <div className="message-bubble">
      <ReactMarkdown>{content}</ReactMarkdown>
      {isStreaming && <span className="cursor">|</span>}
    </div>
  );
}
```

## Performance Considerations

### `flushSync` vs `requestAnimationFrame`
Updating React state on every single chunk can be expensive if chunks arrive very fast (e.g., local LLMs). 
-   **Throttling**: You might want to buffer chunks and update the state every 50ms or 100ms.
-   **React 18 Batching**: Automatic batching helps, but heavy render trees can still lag.

### AbortController
Always implement cancellation. Users might change their mind while the model is thinking.

```javascript
// Inside the hook
const abortControllerRef = useRef(null);

const stop = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
};

// Pass signal to fetch
const response = await fetch(url, { 
  signal: abortControllerRef.current.signal 
  // ... 
});
```

## Conclusion

Streaming is not just a visual flair; it's a necessity for AI interfaces. By mastering `ReadableStream` and efficient state updates, you can create chat interfaces that feel responsive and "alive".
