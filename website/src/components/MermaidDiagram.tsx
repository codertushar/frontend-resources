'use client';

import { useEffect, useRef, useState, memo } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

// Module-level cache so re-mounts don't re-render the same chart
const svgCache = new Map<string, string>();

let mermaidIdCounter = 0;

function MermaidDiagramInner({ chart }: MermaidDiagramProps) {
  const trimmedChart = chart.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>(() => svgCache.get(trimmedChart) || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Already have cached SVG — skip rendering
    if (svgCache.has(trimmedChart)) {
      setSvg(svgCache.get(trimmedChart)!);
      return;
    }

    let cancelled = false;

    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
          sequence: { useMaxWidth: true },
        });

        const id = `mermaid-${++mermaidIdCounter}`;
        const { svg: renderedSvg } = await mermaid.render(id, trimmedChart);
        if (!cancelled) {
          svgCache.set(trimmedChart, renderedSvg);
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    };

    renderChart();
    return () => { cancelled = true; };
  }, [trimmedChart]);

  if (error) {
    return (
      <pre style={{ color: '#f87171', background: '#1e1e1e', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#888', background: '#1e1e1e', borderRadius: '8px' }}>
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram"
      style={{
        background: '#1e1e1e',
        borderRadius: '8px',
        padding: '1.5rem',
        margin: '1.5rem 0',
        overflow: 'auto',
        textAlign: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const MermaidDiagram = memo(MermaidDiagramInner, (prev, next) => {
  return prev.chart.trim() === next.chart.trim();
});

export default MermaidDiagram;
