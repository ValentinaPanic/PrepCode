import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const questions = [
  // ─── React ────────────────────────────────────────────────────────────────

  {
    topic: 'react', difficulty: 'easy', format: 'multiple_choice',
    question: 'Which hook would you use to run a side effect after a component renders?',
    options: [
      { label: 'A', text: 'useState' },
      { label: 'B', text: 'useEffect' },
      { label: 'C', text: 'useRef' },
      { label: 'D', text: 'useContext' },
    ],
    correct_answer: 'B',
    explanation: 'useEffect runs after every render by default. You control when it re-runs with the dependency array. useState stores values, useRef gives DOM access, and useContext reads context values.',
  },
  {
    topic: 'react', difficulty: 'easy', format: 'multiple_choice',
    question: 'What does an empty dependency array [] in useEffect do?',
    options: [
      { label: 'A', text: 'Runs the effect on every render' },
      { label: 'B', text: 'Disables the effect entirely' },
      { label: 'C', text: 'Runs the effect once after the initial render' },
      { label: 'D', text: 'Runs the effect only when the component unmounts' },
    ],
    correct_answer: 'C',
    explanation: 'An empty array tells React there are no dependencies to watch, so the effect only runs once after the first render — equivalent to componentDidMount in class components.',
  },
  {
    topic: 'react', difficulty: 'easy', format: 'short_answer',
    question: 'What is the name of the method you call to update a value stored in useState?',
    options: null,
    correct_answer: 'setter function',
    explanation: 'useState returns a tuple: [value, setter]. The setter (often named setX by convention) triggers a re-render with the new value when called.',
  },
  {
    topic: 'react', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the purpose of the key prop when rendering a list in React?',
    options: [
      { label: 'A', text: 'It styles each list item uniquely' },
      { label: 'B', text: 'It helps React identify which items changed, were added, or removed' },
      { label: 'C', text: 'It sets the tab order for accessibility' },
      { label: 'D', text: 'It is required for TypeScript type checking' },
    ],
    correct_answer: 'B',
    explanation: 'Keys help React\'s reconciliation algorithm match elements between renders. Without stable keys, React may re-render the wrong items or lose component state during list updates.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'multiple_choice',
    question: 'You call setCount(count + 1) twice in a row. Why does count only increase by 1?',
    options: [
      { label: 'A', text: 'React batches state updates and deduplications' },
      { label: 'B', text: 'Both calls read the same stale value of count from the closure' },
      { label: 'C', text: 'setCount is asynchronous and the second call is ignored' },
      { label: 'D', text: 'React limits state updates to one per event handler' },
    ],
    correct_answer: 'B',
    explanation: 'Both calls close over the same count value from the current render. The fix is the functional form: setCount(prev => prev + 1), which always receives the latest value.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does useCallback do?',
    options: [
      { label: 'A', text: 'Runs a callback after every render' },
      { label: 'B', text: 'Memoises a function so it is not recreated on every render' },
      { label: 'C', text: 'Creates a ref to a DOM element' },
      { label: 'D', text: 'Caches the result of an expensive calculation' },
    ],
    correct_answer: 'B',
    explanation: 'useCallback returns the same function reference between renders unless its dependencies change. This matters when passing functions as props to memoised children or using them in useEffect dependency arrays.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is the difference between useRef and useState?',
    options: [
      { label: 'A', text: 'useRef can only hold DOM references, useState can hold any value' },
      { label: 'B', text: 'Updating a ref does not trigger a re-render, updating state does' },
      { label: 'C', text: 'useState persists across renders, useRef does not' },
      { label: 'D', text: 'There is no practical difference' },
    ],
    correct_answer: 'B',
    explanation: 'Both persist values across renders, but only state changes trigger re-renders. useRef is ideal for tracking values the UI does not need to display — like timers, previous values, or DOM node references.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'short_answer',
    question: 'What React hook would you use to avoid recalculating an expensive value on every render?',
    options: null,
    correct_answer: 'useMemo',
    explanation: 'useMemo caches the result of a function between renders and only recomputes it when its dependencies change — similar to useCallback but for values rather than functions.',
  },
  {
    topic: 'react', difficulty: 'hard', format: 'multiple_choice',
    question: 'What does React.memo do?',
    options: [
      { label: 'A', text: 'Memoises the return value of a hook' },
      { label: 'B', text: 'Prevents a component from re-rendering if its props have not changed' },
      { label: 'C', text: 'Caches API responses between renders' },
      { label: 'D', text: 'Delays rendering until the browser is idle' },
    ],
    correct_answer: 'B',
    explanation: 'React.memo wraps a component and does a shallow comparison of props between renders. If props are the same, React skips re-rendering that component. It only helps when the parent re-renders frequently and the child is expensive to render.',
  },
  {
    topic: 'react', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is the difference between useEffect and useLayoutEffect?',
    options: [
      { label: 'A', text: 'useLayoutEffect only runs on the server, useEffect only on the client' },
      { label: 'B', text: 'useLayoutEffect fires synchronously after DOM mutations but before the browser paints' },
      { label: 'C', text: 'useLayoutEffect runs before the component renders' },
      { label: 'D', text: 'There is no difference in a functional component' },
    ],
    correct_answer: 'B',
    explanation: 'useLayoutEffect fires before the browser has a chance to paint, making it suitable for DOM measurements and mutations that must happen synchronously (e.g. reading scroll position, avoiding visual flicker). useEffect fires after the paint.',
  },
  {
    topic: 'react', difficulty: 'hard', format: 'short_answer',
    question: 'What is React reconciliation?',
    options: null,
    correct_answer: 'diffing virtual DOM trees',
    explanation: 'Reconciliation is React\'s algorithm for comparing the previous and new virtual DOM trees to determine the minimal set of real DOM changes needed. This is what makes React updates efficient.',
  },

  // ─── JavaScript ───────────────────────────────────────────────────────────

  {
    topic: 'javascript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the difference between == and ===?',
    options: [
      { label: 'A', text: '== checks value and type, === checks only value' },
      { label: 'B', text: '== coerces types before comparing, === does not' },
      { label: 'C', text: 'They are identical — just different syntax styles' },
      { label: 'D', text: '=== is only used for objects, == for primitives' },
    ],
    correct_answer: 'B',
    explanation: '== performs type coercion, so "5" == 5 is true. === requires both value and type to match, so "5" === 5 is false. Always prefer === to avoid surprising coercion bugs.',
  },
  {
    topic: 'javascript', difficulty: 'easy', format: 'short_answer',
    question: 'What does typeof null return in JavaScript?',
    options: null,
    correct_answer: 'object',
    explanation: 'This is a well-known bug in JavaScript that was never fixed for backwards compatibility. null is a primitive, but typeof null returns "object". Always check for null explicitly: value === null.',
  },
  {
    topic: 'javascript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is hoisting in JavaScript?',
    options: [
      { label: 'A', text: 'Moving import statements to the top of the file automatically' },
      { label: 'B', text: 'The behaviour where variable and function declarations are processed before code runs' },
      { label: 'C', text: 'Automatically converting var to let during compilation' },
      { label: 'D', text: 'Lifting a function into a parent scope' },
    ],
    correct_answer: 'B',
    explanation: 'Declarations (not initialisations) are hoisted to the top of their scope. var variables are hoisted and initialised to undefined. let and const are hoisted but not initialised — accessing them before declaration throws a ReferenceError (the temporal dead zone).',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is a closure?',
    options: [
      { label: 'A', text: 'A function that has no return value' },
      { label: 'B', text: 'A function that retains access to variables from its outer scope even after that scope has finished executing' },
      { label: 'C', text: 'A method for closing event listeners to prevent memory leaks' },
      { label: 'D', text: 'A design pattern for encapsulating private class methods' },
    ],
    correct_answer: 'B',
    explanation: 'When a function is defined inside another function, it forms a closure — it "closes over" the outer variables and can access them even after the outer function has returned. This is how module patterns, callbacks, and React hooks store state.',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is event delegation?',
    options: [
      { label: 'A', text: 'Passing an event handler as a prop to a child component' },
      { label: 'B', text: 'Attaching a single event listener to a parent element instead of many listeners to children' },
      { label: 'C', text: 'Deferring event handling until the browser is idle' },
      { label: 'D', text: 'Delegating DOM events to a web worker' },
    ],
    correct_answer: 'B',
    explanation: 'Because events bubble up the DOM, you can listen on a parent and check event.target to determine which child was clicked. This is more efficient than attaching listeners to every child — especially useful in dynamic lists.',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is the difference between Promise.all and Promise.allSettled?',
    options: [
      { label: 'A', text: 'Promise.all waits for all promises; Promise.allSettled only waits for the first' },
      { label: 'B', text: 'Promise.all rejects immediately if any promise fails; Promise.allSettled waits for all regardless' },
      { label: 'C', text: 'Promise.allSettled is faster because it runs promises in parallel' },
      { label: 'D', text: 'There is no difference — they are aliases' },
    ],
    correct_answer: 'B',
    explanation: 'Promise.all short-circuits on the first rejection. Promise.allSettled always waits for every promise and gives you the outcome of each (fulfilled or rejected). Use allSettled when you need results from all calls even if some fail.',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'short_answer',
    question: 'What does the Array.prototype.reduce method return if no initial value is provided and the array has one element?',
    options: null,
    correct_answer: 'that element',
    explanation: 'With no initial value, reduce uses the first element as the accumulator and starts iterating from the second. If there is only one element, it is returned directly without calling the callback at all.',
  },
  {
    topic: 'javascript', difficulty: 'hard', format: 'multiple_choice',
    question: 'In what order does the following run: setTimeout(fn, 0), a resolved Promise.then(fn), and a synchronous console.log?',
    options: [
      { label: 'A', text: 'setTimeout → Promise → console.log' },
      { label: 'B', text: 'console.log → setTimeout → Promise' },
      { label: 'C', text: 'console.log → Promise → setTimeout' },
      { label: 'D', text: 'Promise → console.log → setTimeout' },
    ],
    correct_answer: 'C',
    explanation: 'Synchronous code runs first. Then microtasks (Promise callbacks) run before macrotasks (setTimeout). So: console.log → Promise.then → setTimeout. This is because the microtask queue is drained completely before the event loop picks up the next macrotask.',
  },
  {
    topic: 'javascript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What does Object.freeze do?',
    options: [
      { label: 'A', text: 'Prevents the variable from being reassigned' },
      { label: 'B', text: 'Deeply freezes all nested objects recursively' },
      { label: 'C', text: 'Prevents adding, removing, or modifying properties on the object' },
      { label: 'D', text: 'Converts the object to an immutable Map' },
    ],
    correct_answer: 'C',
    explanation: 'Object.freeze makes the top-level properties of an object read-only. It is shallow — nested objects are not frozen. Attempting to mutate a frozen object silently fails in sloppy mode and throws in strict mode.',
  },
  {
    topic: 'javascript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is the output of [1, 2, 3].map(parseInt)?',
    options: [
      { label: 'A', text: '[1, 2, 3]' },
      { label: 'B', text: '[1, NaN, NaN]' },
      { label: 'C', text: '[1, NaN, 3]' },
      { label: 'D', text: '[1, 2, NaN]' },
    ],
    correct_answer: 'B',
    explanation: 'map passes three arguments to the callback: value, index, array. parseInt receives value and index as the radix. parseInt(1, 0) → 1, parseInt(2, 1) → NaN (radix 1 is invalid), parseInt(3, 2) → NaN (3 is not valid in base 2).',
  },

  // ─── TypeScript ───────────────────────────────────────────────────────────

  {
    topic: 'typescript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What does the ? operator mean when added to an interface property?',
    options: [
      { label: 'A', text: 'The property can be null' },
      { label: 'B', text: 'The property is optional — it may or may not exist on the object' },
      { label: 'C', text: 'The property is read-only' },
      { label: 'D', text: 'The property is deprecated' },
    ],
    correct_answer: 'B',
    explanation: 'interface User { name?: string } means name may or may not be present. TypeScript will require you to handle the undefined case before using the value. This is different from name: string | null, which requires the key to exist but allows null.',
  },
  {
    topic: 'typescript', difficulty: 'easy', format: 'short_answer',
    question: 'What TypeScript type represents a value that could be any type, but requires you to check the type before using it?',
    options: null,
    correct_answer: 'unknown',
    explanation: 'unknown is the type-safe alternative to any. You cannot call methods or access properties on an unknown value until you have narrowed its type with a type guard. any skips all type checking, unknown does not.',
  },
  {
    topic: 'typescript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is a union type?',
    options: [
      { label: 'A', text: 'A type that combines the properties of two interfaces' },
      { label: 'B', text: 'A type that can be one of several specified types' },
      { label: 'C', text: 'A type used for database join operations' },
      { label: 'D', text: 'A type that allows any value' },
    ],
    correct_answer: 'B',
    explanation: 'type Status = "loading" | "success" | "error" is a union — the value can only be one of those three strings. TypeScript enforces this at compile time and enables exhaustive checking in switch statements.',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does the keyof operator do?',
    options: [
      { label: 'A', text: 'Returns the number of keys in an object at runtime' },
      { label: 'B', text: 'Produces a union type of all keys of a given type' },
      { label: 'C', text: 'Removes a key from an object type' },
      { label: 'D', text: 'Makes all keys of an object required' },
    ],
    correct_answer: 'B',
    explanation: 'keyof User produces "id" | "name" | "email" if those are User\'s properties. This is useful for writing generic functions that accept a key name: function get<T>(obj: T, key: keyof T).',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is a type guard?',
    options: [
      { label: 'A', text: 'A TypeScript compiler plugin that prevents unsafe casts' },
      { label: 'B', text: 'A runtime check that narrows the type of a value within a block' },
      { label: 'C', text: 'A decorator that enforces types at runtime' },
      { label: 'D', text: 'A way to prevent null values from being assigned' },
    ],
    correct_answer: 'B',
    explanation: 'A type guard is a conditional check that TypeScript understands as narrowing. typeof x === "string", instanceof checks, and custom "is" functions (value is SomeType) are all type guards. After the check, TypeScript knows the narrowed type inside that block.',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does the ! non-null assertion operator tell TypeScript?',
    options: [
      { label: 'A', text: 'That the value should be inverted (like logical NOT)' },
      { label: 'B', text: 'That the value is definitely not null or undefined — skip null checking' },
      { label: 'C', text: 'That the value will be null at this point intentionally' },
      { label: 'D', text: 'That the property is required in a Partial type' },
    ],
    correct_answer: 'B',
    explanation: 'The ! tells TypeScript "I know this is not null or undefined, trust me." It removes null and undefined from the type. Use sparingly — if you\'re wrong, you\'ll get a runtime error. Prefer proper null checks where possible.',
  },
  {
    topic: 'typescript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What are generics in TypeScript?',
    options: [
      { label: 'A', text: 'A way to define types that work with any value by using type parameters' },
      { label: 'B', text: 'A shorthand for creating interface extensions' },
      { label: 'C', text: 'Reusable code snippets like templates' },
      { label: 'D', text: 'Interfaces that allow optional properties' },
    ],
    correct_answer: 'A',
    explanation: 'Generics let you write a function or type that works with multiple types while preserving type information. function identity<T>(x: T): T returns the same type it receives. This is more useful than any because the caller\'s type is preserved.',
  },
  {
    topic: 'typescript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is a discriminated union?',
    options: [
      { label: 'A', text: 'A union type where each member has a unique literal property used to tell them apart' },
      { label: 'B', text: 'A union that excludes null and undefined' },
      { label: 'C', text: 'A union type that only works with string values' },
      { label: 'D', text: 'A pattern for removing a type from a union' },
    ],
    correct_answer: 'A',
    explanation: 'type Result = { status: "ok"; data: User } | { status: "error"; message: string } is a discriminated union. The shared "status" property is the discriminant. TypeScript can narrow to the correct branch in a switch statement on status, giving you full type safety on each branch.',
  },
  {
    topic: 'typescript', difficulty: 'hard', format: 'short_answer',
    question: 'What TypeScript utility type makes all properties of a type optional?',
    options: null,
    correct_answer: 'Partial',
    explanation: 'Partial<User> produces a type where every property of User is optional. It is equivalent to manually adding ? to every field. Commonly used for update functions where you only pass the fields you want to change.',
  },

  // ─── CSS ─────────────────────────────────────────────────────────────────

  {
    topic: 'css', difficulty: 'easy', format: 'multiple_choice',
    question: 'What are the four parts of the CSS box model, from inside to outside?',
    options: [
      { label: 'A', text: 'content → border → padding → margin' },
      { label: 'B', text: 'content → padding → border → margin' },
      { label: 'C', text: 'margin → border → content → padding' },
      { label: 'D', text: 'padding → content → margin → border' },
    ],
    correct_answer: 'B',
    explanation: 'Content is the innermost box, then padding (space inside the border), then border, then margin (space outside the border). With box-sizing: border-box, width and height include padding and border but not margin.',
  },
  {
    topic: 'css', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the difference between display: block and display: inline?',
    options: [
      { label: 'A', text: 'Block elements cannot contain inline elements' },
      { label: 'B', text: 'Block takes full width and starts on a new line; inline flows with text and only takes the space it needs' },
      { label: 'C', text: 'Inline elements cannot have padding or margin' },
      { label: 'D', text: 'Block elements cannot have a fixed width' },
    ],
    correct_answer: 'B',
    explanation: 'Block elements (div, p, h1) expand to fill their container and stack vertically. Inline elements (span, a, strong) flow within text and only take as much width as their content. Inline elements ignore top/bottom margin and cannot have a set height.',
  },
  {
    topic: 'css', difficulty: 'easy', format: 'short_answer',
    question: 'What CSS property controls how an element is positioned — whether it participates in normal document flow or not?',
    options: null,
    correct_answer: 'position',
    explanation: 'The position property accepts static (default, in flow), relative (offset from normal position), absolute (removed from flow, positioned relative to nearest non-static ancestor), fixed (relative to viewport), and sticky.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is CSS specificity?',
    options: [
      { label: 'A', text: 'The order in which stylesheets are loaded' },
      { label: 'B', text: 'A weight system that determines which CSS rule wins when multiple rules target the same element' },
      { label: 'C', text: 'The number of CSS properties applied to an element' },
      { label: 'D', text: 'How precisely a CSS selector matches its target' },
    ],
    correct_answer: 'B',
    explanation: 'Specificity is calculated as (inline styles, IDs, classes/attributes/pseudo-classes, elements). Higher specificity wins regardless of source order. Inline > ID > class > element. !important overrides all specificity.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is the difference between em and rem units?',
    options: [
      { label: 'A', text: 'em is relative to the root font size, rem is relative to the parent element' },
      { label: 'B', text: 'em is relative to the current element\'s font size, rem is relative to the root (html) font size' },
      { label: 'C', text: 'rem is only supported in modern browsers, em is universal' },
      { label: 'D', text: 'They are identical — just different naming conventions' },
    ],
    correct_answer: 'B',
    explanation: 'em compounds — a 2em font-size inside a 2em parent results in 4× the root size. rem is always relative to the root html element, making it predictable. rem is generally preferred for spacing and font sizes for this reason.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'multiple_choice',
    question: 'When does z-index not work?',
    options: [
      { label: 'A', text: 'When the element has display: flex' },
      { label: 'B', text: 'When the element has position: static (the default)' },
      { label: 'C', text: 'When the z-index value is below 100' },
      { label: 'D', text: 'When the element has overflow: hidden' },
    ],
    correct_answer: 'B',
    explanation: 'z-index only works on positioned elements — those with position set to relative, absolute, fixed, or sticky. On static elements it has no effect. This is one of the most common CSS gotchas.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'short_answer',
    question: 'What CSS property would you use to make a flex child grow and fill remaining space?',
    options: null,
    correct_answer: 'flex-grow',
    explanation: 'flex-grow: 1 tells the item to take up any remaining space in the flex container. If multiple items have flex-grow: 1 they share the space equally. The shorthand flex: 1 also sets flex-shrink and flex-basis.',
  },
  {
    topic: 'css', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is a stacking context in CSS?',
    options: [
      { label: 'A', text: 'A new coordinate system created by certain CSS properties that affects how z-index behaves for child elements' },
      { label: 'B', text: 'The order in which stylesheets stack on top of each other' },
      { label: 'C', text: 'A container with overflow: scroll that stacks its children' },
      { label: 'D', text: 'A flexbox or grid container' },
    ],
    correct_answer: 'A',
    explanation: 'A stacking context is created by properties like position with z-index, opacity < 1, transform, filter, and others. Elements inside a stacking context are painted together and their z-index only competes within that context — not against the rest of the page.',
  },
  {
    topic: 'css', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is the difference between visibility: hidden and display: none?',
    options: [
      { label: 'A', text: 'They are identical — both hide the element completely' },
      { label: 'B', text: 'visibility: hidden hides the element but preserves its space in the layout; display: none removes it from the flow entirely' },
      { label: 'C', text: 'display: none hides visually but keeps it accessible to screen readers' },
      { label: 'D', text: 'visibility: hidden also removes the element from the accessibility tree' },
    ],
    correct_answer: 'B',
    explanation: 'visibility: hidden makes the element invisible but it still occupies space in the layout. display: none removes the element from the document flow entirely — no space, no interaction. Both hide from screen readers by default.',
  },
  {
    topic: 'css', difficulty: 'hard', format: 'short_answer',
    question: 'What is the name of the CSS layout model that uses named template areas defined with grid-template-areas?',
    options: null,
    correct_answer: 'CSS Grid',
    explanation: 'CSS Grid\'s grid-template-areas lets you define a visual map of your layout using named strings. Each cell in the grid can be assigned to a named area, and children use grid-area: name to place themselves. This makes complex layouts readable and maintainable.',
  },
]

async function seed() {
  console.log(`Seeding ${questions.length} questions...`)

  const { error } = await supabase.from('quiz_questions').insert(questions)

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log('Done.')
}

seed()
