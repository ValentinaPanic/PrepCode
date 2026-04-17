import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import type { StyleMode } from './StyleModeToggle'

interface Props {
  htmlValue: string
  cssValue: string
  onHTMLChange: (value: string) => void
  onCSSChange: (value: string) => void
  styleMode: StyleMode
}

export function CodeEditorPane({ htmlValue, cssValue, onHTMLChange, onCSSChange, styleMode }: Props) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* HTML editor — always visible */}
      <div className="flex-1 min-h-0 flex flex-col">
        <span className="text-zinc-500 text-xs mb-1 font-mono">HTML</span>
        <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-zinc-700">
          <CodeMirror
            value={htmlValue}
            onChange={onHTMLChange}
            extensions={[html()]}
            theme="dark"
            basicSetup={{ lineNumbers: true, foldGutter: false }}
            className="h-full text-sm"
          />
        </div>
      </div>

      {/* CSS editor — only visible in CSS mode */}
      {styleMode === 'css' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <span className="text-zinc-500 text-xs mb-1 font-mono">CSS</span>
          <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-zinc-700">
            <CodeMirror
              value={cssValue}
              onChange={onCSSChange}
              extensions={[css()]}
              theme="dark"
              basicSetup={{ lineNumbers: true, foldGutter: false }}
              className="h-full text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}
