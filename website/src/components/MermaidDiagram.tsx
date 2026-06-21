'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../context/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
}

// Cache keyed by chart+theme so switching themes re-renders correctly
const svgCache = new Map<string, string>();

let mermaidIdCounter = 0;

function FullscreenOverlay({ svg, onClose, isDark }: { svg: string; onClose: () => void; isDark: boolean }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 4;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(MAX_SCALE, s + 0.25));
      if (e.key === '-') setScale((s) => Math.max(MIN_SCALE, s - 0.25));
      if (e.key === '0') { setScale(1); setPosition({ x: 0, y: 0 }); positionRef.current = { x: 0, y: 0 }; }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - positionRef.current.x, y: e.clientY - positionRef.current.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const newPos = { x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y };
    positionRef.current = newPos;
    setPosition(newPos);
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    positionRef.current = { x: 0, y: 0 };
  }, []);

  const btnStyle: React.CSSProperties = {
    background: isDark ? '#333' : '#e5e7eb',
    border: 'none',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDark ? '#ccc' : '#374151',
    fontSize: '1rem',
    fontWeight: 'bold',
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        cursor: isPanning ? 'grabbing' : 'default',
        padding: '2rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? '#1e1e1e' : '#ffffff',
          borderRadius: '12px',
          padding: '0',
          width: '95vw',
          height: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          cursor: isPanning ? 'grabbing' : 'grab',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            borderBottom: isDark ? '1px solid #333' : '1px solid #e5e7eb',
            cursor: 'default',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => setScale((s) => Math.max(MIN_SCALE, s - 0.25))} style={btnStyle} title="Zoom out (-)">−</button>
            <span style={{ color: isDark ? '#aaa' : '#555', fontSize: '0.8rem', minWidth: '3.5rem', textAlign: 'center' }}>
              {Math.round(scale * 100)}%
            </span>
            <button onClick={() => setScale((s) => Math.min(MAX_SCALE, s + 0.25))} style={btnStyle} title="Zoom in (+)">+</button>
            <button onClick={resetView} style={{ ...btnStyle, width: 'auto', padding: '0 8px', fontSize: '0.75rem' }} title="Reset view (0)">Reset</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: isDark ? '#666' : '#999', fontSize: '0.7rem' }}>
              Scroll to zoom · Drag to pan · Esc to close
            </span>
            <button onClick={onClose} aria-label="Close fullscreen" style={{ ...btnStyle, borderRadius: '50%' }}>✕</button>
          </div>
        </div>

        {/* Zoomable/pannable canvas */}
        <div
          ref={contentRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease',
              textAlign: 'center',
              padding: '2rem',
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

function MermaidDiagramInner({ chart }: MermaidDiagramProps) {
  const trimmedChart = chart.trim();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cacheKey = `${trimmedChart}::${theme}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>(() => svgCache.get(cacheKey) || '');
  const [error, setError] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (svgCache.has(cacheKey)) {
      setSvg(svgCache.get(cacheKey)!);
      return;
    }

    let cancelled = false;
    setSvg(''); // Reset while re-rendering for new theme

    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
          sequence: { useMaxWidth: true },
        });

        const id = `mermaid-${++mermaidIdCounter}`;
        const { svg: renderedSvg } = await mermaid.render(id, trimmedChart);
        if (!cancelled) {
          svgCache.set(cacheKey, renderedSvg);
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    };

    renderChart();
    return () => { cancelled = true; };
  }, [trimmedChart, cacheKey, isDark]);

  const handleClose = useCallback(() => setIsFullscreen(false), []);

  const bg = isDark ? '#1e1e1e' : '#f8f9fa';
  const textColor = isDark ? '#888' : '#666';
  const errorColor = isDark ? '#f87171' : '#dc2626';

  if (error) {
    return (
      <pre style={{ color: errorColor, background: bg, padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: textColor, background: bg, borderRadius: '8px', margin: '1.5rem auto', maxWidth: 'fit-content', minWidth: '280px' }}>
        Loading diagram…
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="mermaid-diagram"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: bg,
          borderRadius: '8px',
          padding: '1.5rem',
          margin: '1.5rem auto',
          overflow: 'auto',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'zoom-in',
          minHeight: '200px',
          width: '100%',
          maxWidth: '100%',
          transition: 'box-shadow 0.2s ease',
          boxShadow: isHovered ? (isDark ? '0 0 0 2px #555' : '0 0 0 2px #c7d2fe') : 'none',
        }}
        onClick={() => setIsFullscreen(true)}
      >
        {/* Expand icon on hover */}
        <div
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            background: isDark ? 'rgba(50,50,50,0.9)' : 'rgba(255,255,255,0.9)',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            color: isDark ? '#aaa' : '#555',
            pointerEvents: 'none',
            border: isDark ? '1px solid #444' : '1px solid #ddd',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          Click to expand
        </div>

        <div
          style={{ width: '100%', minWidth: '300px' }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>

      {isFullscreen && <FullscreenOverlay svg={svg} onClose={handleClose} isDark={isDark} />}
    </>
  );
}

const MermaidDiagram = memo(MermaidDiagramInner, (prev, next) => {
  return prev.chart.trim() === next.chart.trim();
});

export default MermaidDiagram;
