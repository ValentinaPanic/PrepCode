import { useEffect, useRef, useCallback } from 'react'
import type { DOMElement } from '../../lib/specChecks'
import type { StyleMode } from './StyleModeToggle'

interface Props {
  htmlValue: string
  cssValue: string
  styleMode: StyleMode
  onDOMSummary: (elements: DOMElement[]) => void
  runCount: number  // increments each time the user clicks Run
}

/**
 * Renders user HTML inside a sandboxed iframe.
 *
 * After the iframe loads, an injected script reads the DOM,
 * flattens it into a summary, and posts it back to the parent
 * via postMessage. The parent (this component) listens for
 * that message and passes it up to the scoring logic.
 */
export function PreviewPane({ htmlValue, cssValue, styleMode, onDOMSummary, runCount }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Listen for postMessage from the iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'dom-summary') {
      onDOMSummary(event.data.payload as DOMElement[])
    }
  }, [onDOMSummary])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  // Build the srcdoc content
  const inspectorScript = `
<script>
  window.addEventListener('load', function() {
    var elements = document.querySelectorAll('body *:not(script)');
    var summary = [];
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var attrs = {};
      for (var j = 0; j < el.attributes.length; j++) {
        attrs[el.attributes[j].name] = el.attributes[j].value;
      }
      summary.push({
        tag: el.tagName.toLowerCase(),
        attrs: attrs,
        text: (el.textContent || '').trim().slice(0, 200)
      });
    }
    window.parent.postMessage({ type: 'dom-summary', payload: summary }, '*');
  });
</script>`

  const srcdoc = `<!DOCTYPE html>
<html>
<head>
  ${styleMode === 'tailwind'
    ? '<script src="https://cdn.tailwindcss.com"><\/script>'
    : `<style>${cssValue}</style>`
  }
</head>
<body style="padding: 1.5rem; background: white; font-family: system-ui, sans-serif;">
  ${htmlValue}
  ${inspectorScript}
</body>
</html>`

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <span className="text-zinc-500 text-xs mb-1 font-mono">Preview</span>
      <div className="flex-1 min-h-0 rounded-lg border border-zinc-700 overflow-hidden bg-white">
        {runCount > 0 ? (
          <iframe
            ref={iframeRef}
            key={runCount}
            sandbox="allow-scripts"
            srcDoc={srcdoc}
            className="w-full h-full border-0"
            title="Component preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400 text-sm bg-zinc-800">
            Click Run to see your component
          </div>
        )}
      </div>
    </div>
  )
}
