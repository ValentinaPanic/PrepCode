import { useState, useCallback } from 'react'
import type { ComponentChallenge } from '../../data/componentChallenges'
import type { DOMElement } from '../../lib/specChecks'
import type { StyleMode } from './StyleModeToggle'
import { ChallengeDescription } from './ChallengeDescription'
import { StyleModeToggle } from './StyleModeToggle'
import { CodeEditorPane } from './CodeEditorPane'
import { PreviewPane } from './PreviewPane'
import { ScorePanel } from './ScorePanel'

interface Props {
  challenge: ComponentChallenge
  onBack: () => void
  onScoreUpdate?: (score: number) => void
}

export function ChallengeWorkspace({ challenge, onBack, onScoreUpdate }: Props) {
  const [htmlValue, setHTMLValue] = useState(challenge.starterHTML)
  const [cssValue, setCSSValue] = useState(challenge.starterCSS)
  const [styleMode, setStyleMode] = useState<StyleMode>('css')
  const [runCount, setRunCount] = useState(0)
  const [domElements, setDomElements] = useState<DOMElement[] | null>(null)

  const handleRun = () => {
    setRunCount(prev => prev + 1)
  }

  const handleDOMSummary = useCallback((elements: DOMElement[]) => {
    setDomElements(elements)

    // Calculate score and report it up
    if (onScoreUpdate) {
      const passed = challenge.checks.filter(c => c.check(elements)).length
      const percent = Math.round((passed / challenge.checks.length) * 100)
      onScoreUpdate(percent)
    }
  }, [challenge.checks, onScoreUpdate])

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <button
          onClick={onBack}
          className="text-zinc-400 hover:text-white text-sm transition-colors"
        >
          &larr; Challenges
        </button>
        <StyleModeToggle mode={styleMode} onChange={setStyleMode} />
        <button
          onClick={handleRun}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          Run
        </button>
      </div>

      {/* Main content — 3-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: description + score */}
        <div className="w-64 shrink-0 border-r border-zinc-800 p-4 overflow-y-auto">
          <ChallengeDescription challenge={challenge} />
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">
              Results
            </h3>
            <ScorePanel checks={challenge.checks} elements={domElements} />
          </div>
        </div>

        {/* Center: code editor */}
        <div className="flex-1 min-w-0 p-4 flex flex-col">
          <CodeEditorPane
            htmlValue={htmlValue}
            cssValue={cssValue}
            onHTMLChange={setHTMLValue}
            onCSSChange={setCSSValue}
            styleMode={styleMode}
          />
        </div>

        {/* Right: preview */}
        <div className="flex-1 min-w-0 p-4 flex flex-col border-l border-zinc-800">
          <PreviewPane
            htmlValue={htmlValue}
            cssValue={cssValue}
            styleMode={styleMode}
            onDOMSummary={handleDOMSummary}
            runCount={runCount}
          />
        </div>
      </div>
    </div>
  )
}
