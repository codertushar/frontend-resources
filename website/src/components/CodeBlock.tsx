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
  children: string;
}>;

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
      <Highlighter language={language} style={style} PreTag="div">
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
