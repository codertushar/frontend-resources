'use client';

import { useEffect, useState, memo } from 'react';
import type { ComponentType } from 'react';

interface CodeBlockProps {
  language: string;
  children: string;
}

// react-syntax-highlighter (with Prism) is a large dependency. Loading it
// eagerly blocks the initial article paint. Instead we render a lightweight,
// theme-styled <pre> immediately and swap in the highlighter once it has been
// dynamically imported, so the article text is interactive right away.
type HighlighterComponent = ComponentType<{
  language: string;
  style: unknown;
  PreTag: string;
  customStyle?: Record<string, string | number>;
  codeTagProps?: { style?: Record<string, string | number> };
  children: string;
}>;

// Box metrics kept in exact lockstep with the `.code-block-fallback` rule in
// globals.css. The highlighter renders after a dynamic import completes, so any
// difference in padding/margin/font/line-height between the fallback and the
// highlighted output would resize the block and shift everything below it —
// producing the "jumps up and down while scrolling" jitter. Pinning these
// metrics makes the swap zero-layout-shift.
const CODE_BOX_STYLE: Record<string, string | number> = {
  margin: 0,
  padding: '1em',
  overflowX: 'auto',
  background: '#1e1e1e',
  borderRadius: '8px',
  color: '#d4d4d4',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.9em',
  lineHeight: 1.5,
  tabSize: 2,
};

const CODE_TAG_STYLE: Record<string, string | number> = {
  background: 'none',
  padding: 0,
  color: 'inherit',
  fontFamily: 'var(--font-mono)',
  fontSize: 'inherit',
  lineHeight: 'inherit',
};

let highlighterPromise: Promise<{
  Highlighter: HighlighterComponent;
  style: unknown;
}> | null = null;

// Load once and share across every code block on the page.
const loadHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import('react-syntax-highlighter'),
      import('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus'),
    ]).then(([mod, styleMod]) => ({
      Highlighter: mod.Prism as unknown as HighlighterComponent,
      style: (styleMod as { default: unknown }).default,
    }));
  }
  return highlighterPromise;
};

function CodeBlockImpl({ language, children }: CodeBlockProps) {
  const [highlighter, setHighlighter] = useState<{
    Highlighter: HighlighterComponent;
    style: unknown;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    loadHighlighter().then((h) => {
      if (mounted) setHighlighter(h);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (highlighter) {
    const { Highlighter, style } = highlighter;
    return (
      <Highlighter
        language={language}
        style={style}
        PreTag="div"
        customStyle={CODE_BOX_STYLE}
        codeTagProps={{ style: CODE_TAG_STYLE }}
      >
        {children}
      </Highlighter>
    );
  }

  // Plain fallback shown until the highlighter chunk finishes loading.
  return (
    <pre className="code-block-fallback">
      <code>{children}</code>
    </pre>
  );
}

const CodeBlock = memo(CodeBlockImpl);
export default CodeBlock;
