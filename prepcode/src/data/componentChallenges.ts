import type { SpecCheck, DOMElement } from '../lib/specChecks'
import { hasElement, hasAttr, hasAccessibleName, labelLinked, hasChild } from '../lib/specChecks'

export interface ComponentChallenge {
  id: string
  title: string
  description: string
  hints: string[]
  starterHTML: string
  starterCSS: string
  checks: SpecCheck[]
}

// ─── 1. Button ────────────────────────────────────────────────────────────────

const button: ComponentChallenge = {
  id: 'button',
  title: 'Button',
  description:
    'Build an accessible button. Use the correct semantic element, give it a type attribute, and make sure it has visible text.',
  hints: [
    'Use <button>, not <div> or <span>',
    'Add type="button" to prevent accidental form submission',
    'The text inside the button is its accessible name',
  ],
  starterHTML: '<!-- Build your button here -->\n',
  starterCSS: '/* Style your button */\n',
  checks: [
    { label: 'Uses <button> element', check: hasElement('button') },
    { label: 'Has type attribute', check: hasAttr('button', 'type') },
    { label: 'Has accessible name (visible text)', check: hasAccessibleName('button') },
  ],
}

// ─── 2. Link ──────────────────────────────────────────────────────────────────

const link: ComponentChallenge = {
  id: 'link',
  title: 'Link',
  description:
    'Create an accessible hyperlink. It should point somewhere, have meaningful text, and use the correct element.',
  hints: [
    'Use <a> with an href attribute',
    'Never leave a link empty — screen readers announce it as "link" with no context',
    'Use descriptive text, not "click here"',
  ],
  starterHTML: '<!-- Build your link here -->\n',
  starterCSS: '/* Style your link */\n',
  checks: [
    { label: 'Uses <a> element', check: hasElement('a') },
    { label: 'Has href attribute', check: hasAttr('a', 'href') },
    { label: 'Has accessible name', check: hasAccessibleName('a') },
  ],
}

// ─── 3. Text Input ────────────────────────────────────────────────────────────

const textInput: ComponentChallenge = {
  id: 'text-input',
  title: 'Text Input',
  description:
    'Build a labeled text input. The label must be programmatically linked to the input — not just visually next to it.',
  hints: [
    'Use <input type="text"> with an id',
    'Use <label for="..."> where for matches the input\'s id',
    'This link is how screen readers know what the input is for',
  ],
  starterHTML: '<!-- Build your labeled text input here -->\n',
  starterCSS: '/* Style your input */\n',
  checks: [
    { label: 'Uses <input> element', check: hasElement('input') },
    { label: 'Input has type="text"', check: hasAttr('input', 'type', 'text') },
    { label: 'Input has id attribute', check: hasAttr('input', 'id') },
    { label: 'Label linked to input via for/id', check: labelLinked() },
  ],
}

// ─── 4. Password Input ───────────────────────────────────────────────────────

const passwordInput: ComponentChallenge = {
  id: 'password-input',
  title: 'Password Input',
  description:
    'Build an accessible password field. Include a linked label and the autocomplete attribute for browser password managers.',
  hints: [
    'Use <input type="password">',
    'autocomplete="current-password" helps password managers fill it in',
    'Link the label the same way as a text input',
  ],
  starterHTML: '<!-- Build your password input here -->\n',
  starterCSS: '/* Style your input */\n',
  checks: [
    { label: 'Uses <input> element', check: hasElement('input') },
    { label: 'Input has type="password"', check: hasAttr('input', 'type', 'password') },
    { label: 'Has autocomplete="current-password"', check: hasAttr('input', 'autocomplete', 'current-password') },
    { label: 'Label linked to input', check: labelLinked() },
  ],
}

// ─── 5. Textarea ──────────────────────────────────────────────────────────────

const textarea: ComponentChallenge = {
  id: 'textarea',
  title: 'Textarea',
  description:
    'Build an accessible multi-line text area with a linked label.',
  hints: [
    'Use <textarea>, not <input type="text">',
    'Give it an id and link a <label for="..."> to it',
    'Textareas are for multi-line input like comments or bios',
  ],
  starterHTML: '<!-- Build your textarea here -->\n',
  starterCSS: '/* Style your textarea */\n',
  checks: [
    { label: 'Uses <textarea> element', check: hasElement('textarea') },
    { label: 'Textarea has id attribute', check: hasAttr('textarea', 'id') },
    { label: 'Label linked to textarea', check: labelLinked() },
  ],
}

// ─── 6. Checkbox ──────────────────────────────────────────────────────────────

const checkbox: ComponentChallenge = {
  id: 'checkbox',
  title: 'Checkbox',
  description:
    'Build an accessible checkbox with a linked label. Clicking the label should toggle the checkbox.',
  hints: [
    'Use <input type="checkbox">',
    'When the label is linked via for/id, clicking the label text also toggles the checkbox',
    'This is a huge UX win — bigger click target',
  ],
  starterHTML: '<!-- Build your checkbox here -->\n',
  starterCSS: '/* Style your checkbox */\n',
  checks: [
    { label: 'Uses <input> element', check: hasElement('input') },
    { label: 'Input has type="checkbox"', check: hasAttr('input', 'type', 'checkbox') },
    { label: 'Checkbox has id', check: hasAttr('input', 'id') },
    { label: 'Label linked to checkbox', check: labelLinked() },
  ],
}

// ─── 7. Select ────────────────────────────────────────────────────────────────

const select: ComponentChallenge = {
  id: 'select',
  title: 'Select Dropdown',
  description:
    'Build an accessible dropdown with at least two options and a linked label.',
  hints: [
    'Use <select> with <option> children',
    'The first option is often a placeholder like "Choose..."',
    'Link a label just like you would with an input',
  ],
  starterHTML: '<!-- Build your select dropdown here -->\n',
  starterCSS: '/* Style your select */\n',
  checks: [
    { label: 'Uses <select> element', check: hasElement('select') },
    { label: 'Has <option> children', check: hasChild('select', 'option') },
    { label: 'Select has id', check: hasAttr('select', 'id') },
    { label: 'Label linked to select', check: labelLinked() },
  ],
}

// ─── 8. Form ──────────────────────────────────────────────────────────────────

const form: ComponentChallenge = {
  id: 'form',
  title: 'Form',
  description:
    'Build a complete form with at least one input, a label, and a submit button. Wrap everything in a <form> element.',
  hints: [
    'Use <form> as the outer wrapper',
    'A <button type="submit"> inside a <form> will submit it',
    'Label your inputs — forms without labels are a top accessibility violation',
  ],
  starterHTML: '<!-- Build your form here -->\n',
  starterCSS: '/* Style your form */\n',
  checks: [
    { label: 'Uses <form> element', check: hasElement('form') },
    { label: 'Has an <input> field', check: hasChild('form', 'input') },
    { label: 'Has a submit button', check: (els: DOMElement[]) =>
        els.some(e => e.tag === 'button' && e.attrs['type'] === 'submit') },
    { label: 'Label linked to input', check: labelLinked() },
  ],
}

// ─── 9. Navigation ───────────────────────────────────────────────────────────

const navigation: ComponentChallenge = {
  id: 'navigation',
  title: 'Navigation',
  description:
    'Build a navigation bar. Use semantic HTML so screen readers can identify it as a navigation landmark.',
  hints: [
    '<nav> is the semantic element for navigation — screen readers list it as a landmark',
    'Put links inside a <ul>/<li> structure for proper list semantics',
    'Add aria-label to <nav> if the page has multiple nav regions',
  ],
  starterHTML: '<!-- Build your navigation here -->\n',
  starterCSS: '/* Style your navigation */\n',
  checks: [
    { label: 'Uses <nav> element', check: hasElement('nav') },
    { label: 'Nav has aria-label', check: hasAttr('nav', 'aria-label') },
    { label: 'Contains links (<a>)', check: hasChild('nav', 'a') },
    { label: 'Uses list structure (<ul>)', check: hasChild('nav', 'ul') },
  ],
}

// ─── 10. Card ─────────────────────────────────────────────────────────────────

const card: ComponentChallenge = {
  id: 'card',
  title: 'Card',
  description:
    'Build a content card with semantic structure: a heading, body text, and an action (link or button). Avoid div-soup.',
  hints: [
    'Use <article> as the wrapper — it represents a self-contained piece of content',
    'Use a heading tag (h2 or h3) for the card title, not a styled <div>',
    'Include a link or button as the card action',
  ],
  starterHTML: '<!-- Build your card here -->\n',
  starterCSS: '/* Style your card */\n',
  checks: [
    { label: 'Uses <article> element', check: hasElement('article') },
    { label: 'Has a heading (h2 or h3)', check: (els: DOMElement[]) =>
        els.some(e => e.tag === 'h2' || e.tag === 'h3') },
    { label: 'Has body text (<p>)', check: hasElement('p') },
    { label: 'Has an action (link or button)', check: (els: DOMElement[]) =>
        els.some(e => e.tag === 'a' || e.tag === 'button') },
  ],
}

// ─── Export all challenges ────────────────────────────────────────────────────

export const challenges: ComponentChallenge[] = [
  button,
  link,
  textInput,
  passwordInput,
  textarea,
  checkbox,
  select,
  form,
  navigation,
  card,
]
