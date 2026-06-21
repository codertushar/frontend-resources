'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
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

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        if (!cancelled) setSvg(renderedSvg);
      } catch (err) {
        if (!cancelled) setError(String(err));
      }
    };

    renderChart();
    return () => { cancelled = true; };
  }, [chart]);

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
