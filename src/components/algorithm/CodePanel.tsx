import { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, Copy, Check } from 'lucide-react';
import { createHighlighter, type Highlighter } from 'shiki';
import type { CodeSnippet } from './types';

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['python'],
    });
  }
  return highlighterPromise;
}

interface CodePanelProps {
  codeSnippets: CodeSnippet;
}

// Skeleton loader using shadcn skeleton
function CodeSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

/**
 * Collapsible code implementation panel with syntax highlighting
 * Four tabs: Full Pipeline, Embeddings, Vector Search, Generation
 */
export default function CodePanel({ codeSnippets }: CodePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState<Record<string, string>>({});
  const [isHighlighting, setIsHighlighting] = useState(false);
  const hasHighlightedRef = useRef(false);
  const copyTimeoutRef = useRef<number | null>(null);

  const tabs = useMemo(
    () => [
      { id: 'full', label: 'Full Pipeline', code: codeSnippets.fullPipeline },
      { id: 'embeddings', label: 'Embeddings', code: codeSnippets.embeddings },
      { id: 'search', label: 'Vector Search', code: codeSnippets.vectorSearch },
      { id: 'generation', label: 'Generation', code: codeSnippets.generation },
    ],
    [codeSnippets]
  );

  useEffect(() => {
    if (!isOpen || hasHighlightedRef.current) return;
    hasHighlightedRef.current = true;

    const highlightAll = async () => {
      const highlighted: Record<string, string> = {};
      setIsHighlighting(true);
      try {
        const highlighter = await getHighlighter();
        for (const tab of tabs) {
          const html = highlighter.codeToHtml(tab.code, {
            lang: 'python',
            themes: { light: 'github-light', dark: 'github-dark' },
            defaultColor: false,
          });
          highlighted[tab.id] = html;
        }
      } catch (error) {
        console.error('Failed to highlight code:', error);
        for (const tab of tabs) {
          highlighted[tab.id] = `<pre><code>${tab.code}</code></pre>`;
        }
      } finally {
        setIsHighlighting(false);
        setHighlightedCode(highlighted);
      }
    };

    highlightAll();
  }, [isOpen, tabs]);

  useEffect(() => {
    return () => { if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current); };
  }, []);

  const handleCopy = async (code: string, tabId: string) => {
    await navigator.clipboard.writeText(code);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopiedTab(tabId);
    copyTimeoutRef.current = window.setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-2 border-border rounded-xl bg-bg-elevated overflow-hidden shadow-lg">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-4 py-3 hover:bg-bg-secondary"
          >
            <span className="text-sm font-semibold text-text-primary">Code Implementation</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t border-border">
          <Tabs defaultValue="full" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border p-1">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="relative">
                {!isHighlighting && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => handleCopy(tab.code, tab.id)}
                  >
                    {copiedTab === tab.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {isHighlighting ? (
                  <CodeSkeleton />
                ) : (
                  <div
                    className="overflow-x-auto text-sm"
                    dangerouslySetInnerHTML={{
                      __html: highlightedCode[tab.id] || '<pre><code>Loading...</code></pre>',
                    }}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
