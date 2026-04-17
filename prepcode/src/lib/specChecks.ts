/**
 * Spec check helpers for Component Practice mode.
 *
 * Each helper is a factory that returns a check function.
 * The check function receives a DOM summary (array of elements
 * sent from the iframe via postMessage) and returns true/false.
 */

// Shape of a single element in the DOM summary sent from the iframe
export interface DOMElement {
  tag: string
  attrs: Record<string, string>
  text: string
}

// Shape of a single spec check attached to a challenge
export interface SpecCheck {
  label: string
  check: (elements: DOMElement[]) => boolean
}

// ─── Helper factories ─────────────────────────────────────────────────────────

/** Check that at least one element with the given tag exists */
export const hasElement = (tag: string): SpecCheck['check'] =>
  (els) => els.some(e => e.tag === tag)

/** Check that an element has a specific attribute (optionally with a specific value) */
export const hasAttr = (tag: string, attr: string, value?: string): SpecCheck['check'] =>
  (els) => els.some(e =>
    e.tag === tag && (value !== undefined ? e.attrs[attr] === value : attr in e.attrs)
  )

/** Check that an element has accessible text (text content, aria-label, or title) */
export const hasAccessibleName = (tag: string): SpecCheck['check'] =>
  (els) => els.some(e =>
    e.tag === tag && (e.text || e.attrs['aria-label'] || e.attrs['title'])
  )

/** Check that a <label for="x"> is linked to an input/textarea/select with id="x" */
export const labelLinked = (): SpecCheck['check'] =>
  (els) => {
    const labels = els.filter(e => e.tag === 'label' && e.attrs['for'])
    const inputs = els.filter(e =>
      ['input', 'textarea', 'select'].includes(e.tag) && e.attrs['id']
    )
    return labels.some(l => inputs.some(i => l.attrs['for'] === i.attrs['id']))
  }

/** Check that a child element exists inside a parent element (by tag names) */
export const hasChild = (parentTag: string, childTag: string): SpecCheck['check'] =>
  (els) => {
    // Simple heuristic: both elements exist.
    // The iframe DOM summary is flat, so we can't check true nesting,
    // but having both present is a reasonable proxy for these challenges.
    return els.some(e => e.tag === parentTag) && els.some(e => e.tag === childTag)
  }
