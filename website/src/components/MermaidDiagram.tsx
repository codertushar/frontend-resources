'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { useTheme } from '../context/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
}

// Cache keyed by chart+theme so switching themes re-renders correctly
const svgCache = new Map<string, string>();

let mermaidIdCounter = 0;

function MermaidDiagramInner({ chart }: MermaidDiagramProps) {
  const trimmedChart = chart.trim();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const cacheKey = `${trimmedChart}::${theme}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>(() => svgCache.get(cacheKey) || '');
  const [error, setError] = useState<string>('');

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
    <div
      ref={containerRef}
      className="mermaid-diagram"
      style={{
        background: bg,
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1.5rem auto',
        overflow: 'auto',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const MermaidDiagram = memo(MermaidDiagramInner, (prev, next) => {
  return prev.chart.trim() === next.chart.trim();
});

export default MermaidDiagram;
