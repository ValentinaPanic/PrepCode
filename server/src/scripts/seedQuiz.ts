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

  // ─── JavaScript ──────────────────────────────────────────────────────────

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

  {
    topic: 'javascript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the difference between var, let, and const?',
    options: [
      { label: 'A', text: 'They are all identical — just different style conventions' },
      { label: 'B', text: 'var is function-scoped and hoisted; let and const are block-scoped; const cannot be reassigned' },
      { label: 'C', text: 'const makes an object fully immutable including its nested properties' },
      { label: 'D', text: 'let is only available in TypeScript, not plain JavaScript' },
    ],
    correct_answer: 'B',
    explanation: 'var is hoisted and function-scoped — it leaks out of if/for blocks. let and const are block-scoped and safer. const prevents reassignment of the binding, but does not freeze the object — its properties can still be mutated.',
  },
  {
    topic: 'javascript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What does the spread operator (...) do when used with an array?',
    options: [
      { label: 'A', text: 'It merges two arrays by reference' },
      { label: 'B', text: 'It expands the array elements into individual values' },
      { label: 'C', text: 'It removes duplicate values from the array' },
      { label: 'D', text: 'It converts an array to a Set' },
    ],
    correct_answer: 'B',
    explanation: '[...arr1, ...arr2] creates a new array with all elements from both arrays. [...obj] copies an object\'s own enumerable properties. The spread operator always creates a shallow copy — nested objects are still shared by reference.',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does the optional chaining operator (?.) do?',
    options: [
      { label: 'A', text: 'It makes a property optional in a TypeScript interface' },
      { label: 'B', text: 'It accesses a property and returns undefined instead of throwing if the value is null or undefined' },
      { label: 'C', text: 'It provides a default value when a property is undefined' },
      { label: 'D', text: 'It checks if a method exists before calling it and throws if it does not' },
    ],
    correct_answer: 'B',
    explanation: 'user?.address?.city returns undefined if user or address is null/undefined, instead of throwing "Cannot read property of undefined". Combine with the nullish coalescing operator: user?.name ?? "Guest" to provide a fallback.',
  },
  {
    topic: 'javascript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does the nullish coalescing operator (??) do?',
    options: [
      { label: 'A', text: 'It is identical to the || operator' },
      { label: 'B', text: 'It returns the right-hand side only when the left is null or undefined — not for other falsy values' },
      { label: 'C', text: 'It converts null to undefined for consistency' },
      { label: 'D', text: 'It throws an error if the value is null' },
    ],
    correct_answer: 'B',
    explanation: 'value ?? "default" returns "default" only if value is null or undefined. Unlike ||, it does not treat 0, "", or false as fallback triggers. This makes ?? safer when 0 or an empty string are valid values.',
  },
  {
    topic: 'javascript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is a generator function?',
    options: [
      { label: 'A', text: 'A function that automatically generates TypeScript types' },
      { label: 'B', text: 'A function that can pause execution and resume later, yielding values one at a time' },
      { label: 'C', text: 'A factory function that creates multiple objects of the same shape' },
      { label: 'D', text: 'A function that runs in a Web Worker thread' },
    ],
    correct_answer: 'B',
    explanation: 'Generator functions use function* syntax and yield values one at a time. Each call to next() resumes execution until the next yield. They are useful for lazy sequences, infinite data, and are the foundation of async/await under the hood.',
  },

  // ─── TypeScript ──────────────────────────────────────────────────────────

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

  {
    topic: 'react', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the purpose of React.Fragment?',
    options: [
      { label: 'A', text: 'To create a portal that renders outside the DOM hierarchy' },
      { label: 'B', text: 'To group multiple elements without adding an extra DOM node' },
      { label: 'C', text: 'To memoize a component and prevent re-renders' },
      { label: 'D', text: 'To split code into lazy-loaded chunks' },
    ],
    correct_answer: 'B',
    explanation: 'React.Fragment (or the shorthand <>) lets you return multiple elements from a component without wrapping them in a div. This avoids polluting the DOM with unnecessary wrapper elements that can break layouts.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is prop drilling?',
    options: [
      { label: 'A', text: 'Passing props through many layers of components that do not need them, just to reach a deeply nested child' },
      { label: 'B', text: 'Using the spread operator to pass all props at once' },
      { label: 'C', text: 'Validating props with PropTypes' },
      { label: 'D', text: 'Destructuring props at the top of a component' },
    ],
    correct_answer: 'A',
    explanation: 'Prop drilling is when you pass data through intermediate components that have no use for it themselves — they just forward it down. Common solutions are React Context, a state manager like Redux/Zustand, or component composition.',
  },
  {
    topic: 'react', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is the difference between a controlled and an uncontrolled input?',
    options: [
      { label: 'A', text: 'Controlled inputs use refs; uncontrolled inputs use state' },
      { label: 'B', text: 'Controlled inputs have their value driven by React state; uncontrolled inputs let the DOM manage their own value' },
      { label: 'C', text: 'Uncontrolled inputs are disabled; controlled inputs are editable' },
      { label: 'D', text: 'There is no practical difference in React' },
    ],
    correct_answer: 'B',
    explanation: 'A controlled input has value={state} and onChange={setState} — React is the single source of truth. An uncontrolled input stores its own value in the DOM and you read it with a ref when needed. Controlled inputs are preferred because the value is always in sync with state.',
  },
  {
    topic: 'react', difficulty: 'hard', format: 'multiple_choice',
    question: 'What does React.StrictMode do in development?',
    options: [
      { label: 'A', text: 'It enforces TypeScript type checking at runtime' },
      { label: 'B', text: 'It intentionally double-invokes certain functions to help detect side effects' },
      { label: 'C', text: 'It prevents any state updates outside of event handlers' },
      { label: 'D', text: 'It disables all console.log output' },
    ],
    correct_answer: 'B',
    explanation: 'In development, StrictMode double-invokes render functions, state initialisers, and effect setup/cleanup to help you catch accidental side effects. It has no effect in production. This is why you might see effects run twice — it is intentional.',
  },

  {
    topic: 'typescript', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is an enum in TypeScript?',
    options: [
      { label: 'A', text: 'A way to define a list of named numeric or string constants' },
      { label: 'B', text: 'A utility type that makes properties read-only' },
      { label: 'C', text: 'A decorator for class properties' },
      { label: 'D', text: 'A shorthand for defining a union of string literals' },
    ],
    correct_answer: 'A',
    explanation: 'enum Direction { Up, Down, Left, Right } creates a named set of constants. By default they are numeric (Up = 0, Down = 1...). String enums (Up = "UP") are often preferred for readability. Many teams now prefer union types instead: type Direction = "Up" | "Down".',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does the Readonly utility type do?',
    options: [
      { label: 'A', text: 'It deeply freezes all nested objects at runtime' },
      { label: 'B', text: 'It makes all properties of a type read-only at the TypeScript level' },
      { label: 'C', text: 'It prevents a variable from being reassigned' },
      { label: 'D', text: 'It is equivalent to using const on every property' },
    ],
    correct_answer: 'B',
    explanation: 'Readonly<User> makes every property on User assignable only at creation. TypeScript will error if you try to reassign user.name = "x". It is compile-time only — it does not call Object.freeze at runtime.',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is the difference between a type assertion (as SomeType) and a type guard?',
    options: [
      { label: 'A', text: 'Type assertions are runtime checks; type guards are compile-time only' },
      { label: 'B', text: 'Type assertions tell the compiler to trust you without checking; type guards actually verify the type at runtime' },
      { label: 'C', text: 'They are identical — just different syntax styles' },
      { label: 'D', text: 'Type guards only work with primitive types; assertions work with objects' },
    ],
    correct_answer: 'B',
    explanation: 'value as SomeType is a compile-time instruction that bypasses type checking — it does not verify anything at runtime. A type guard (typeof, instanceof, or a custom is function) actually checks the value at runtime and narrows the type safely. Prefer type guards over assertions.',
  },
  {
    topic: 'typescript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is structural typing in TypeScript?',
    options: [
      { label: 'A', text: 'Types are compatible if they have the same name' },
      { label: 'B', text: 'Types are compatible if an object has all the required properties, regardless of its declared type' },
      { label: 'C', text: 'All types must be declared in a central types.ts file' },
      { label: 'D', text: 'TypeScript enforces type compatibility at runtime' },
    ],
    correct_answer: 'B',
    explanation: 'TypeScript uses structural (duck) typing. If an object has all the properties a type requires, it is assignable — regardless of what class or interface it was declared as. This is different from Java where types are checked by name (nominal typing).',
  },
  {
    topic: 'typescript', difficulty: 'medium', format: 'short_answer',
    question: 'What TypeScript utility type constructs a type by picking a set of properties from another type?',
    options: null,
    correct_answer: 'Pick',
    explanation: 'Pick<User, "id" | "name"> creates a new type with only those two properties from User. The opposite is Omit<User, "password"> which creates a type with everything except the listed keys. Both are commonly used when passing partial shapes between layers of an app.',
  },
  {
    topic: 'typescript', difficulty: 'hard', format: 'multiple_choice',
    question: 'What does the Record<K, V> utility type do?',
    options: [
      { label: 'A', text: 'It records changes to an object over time' },
      { label: 'B', text: 'It constructs an object type with keys of type K and values of type V' },
      { label: 'C', text: 'It converts an array into a map' },
      { label: 'D', text: 'It makes all values in an object the same type' },
    ],
    correct_answer: 'B',
    explanation: 'Record<string, number> is equivalent to { [key: string]: number }. It is commonly used for lookup tables and maps: Record<UserId, User>. More expressive than an index signature when the key type is a known union.',
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
  {
    topic: 'css', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the difference between position: relative and position: absolute?',
    options: [
      { label: 'A', text: 'relative removes the element from normal flow; absolute keeps it in flow' },
      { label: 'B', text: 'relative offsets from its normal position and stays in flow; absolute is removed from flow and positioned relative to its nearest non-static ancestor' },
      { label: 'C', text: 'absolute positions relative to the viewport; relative positions relative to the document' },
      { label: 'D', text: 'They are identical except for the property name' },
    ],
    correct_answer: 'B',
    explanation: 'position: relative keeps the element in the document flow but lets you offset it with top/left/right/bottom. position: absolute removes the element from flow entirely and positions it relative to its nearest positioned ancestor (one with position other than static).',
  },
  {
    topic: 'css', difficulty: 'easy', format: 'multiple_choice',
    question: 'What is the difference between :hover and :focus pseudo-classes?',
    options: [
      { label: 'A', text: ':hover responds to mouse; :focus responds to keyboard navigation or explicit focus' },
      { label: 'B', text: ':focus only works on form elements; :hover works on any element' },
      { label: 'C', text: 'They are identical — both activate on mouse hover' },
      { label: 'D', text: ':hover is CSS3; :focus is CSS2' },
    ],
    correct_answer: 'A',
    explanation: ':hover activates when the mouse pointer is over an element. :focus activates when an element receives focus — via keyboard Tab, clicking an input, or programmatic focus. Always style :focus for accessibility — keyboard users depend on visible focus indicators.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'multiple_choice',
    question: 'What is a CSS pseudo-element?',
    options: [
      { label: 'A', text: 'A class that is added dynamically with JavaScript' },
      { label: 'B', text: 'A keyword added to a selector that lets you style a specific part of an element' },
      { label: 'C', text: 'A placeholder selector used before the real CSS loads' },
      { label: 'D', text: 'A selector that targets elements not yet in the DOM' },
    ],
    correct_answer: 'B',
    explanation: 'Pseudo-elements (::before, ::after, ::first-line, ::placeholder) style a specific part of an element or insert generated content. They use double colons (::) to distinguish from pseudo-classes (:hover, :focus). ::before and ::after require a content property to render.',
  },
  {
    topic: 'css', difficulty: 'medium', format: 'multiple_choice',
    question: 'What does object-fit do?',
    options: [
      { label: 'A', text: 'It controls how a flex item fits inside its container' },
      { label: 'B', text: 'It controls how an image or video is resized to fit its container while preserving or ignoring its aspect ratio' },
      { label: 'C', text: 'It aligns an object to the centre of the page' },
      { label: 'D', text: 'It replaces background-size for inline images' },
    ],
    correct_answer: 'B',
    explanation: 'object-fit is used on replaced elements (img, video). cover fills the container and may crop; contain fits inside without cropping; fill stretches to fill (distorts); none keeps the original size. Pair with object-position to control the focal point.',
  },
  {
    topic: 'css', difficulty: 'hard', format: 'multiple_choice',
    question: 'What is the CSS cascade?',
    options: [
      { label: 'A', text: 'The order in which CSS files are downloaded by the browser' },
      { label: 'B', text: 'The algorithm that determines which CSS rule applies when multiple rules target the same element and property' },
      { label: 'C', text: 'The inheritance of properties from parent to child elements' },
      { label: 'D', text: 'The process of combining multiple stylesheets into one' },
    ],
    correct_answer: 'B',
    explanation: 'The cascade resolves conflicts between competing rules. It considers: origin (browser default < author < inline), importance (!important), specificity (ID > class > element), and source order (later wins if equal). Understanding the cascade is essential to debugging unexpected style overrides.',
  },
]

async function seed() {
  console.log(`Seeding ${questions.length} questions...`)

  // Clear existing questions first to avoid duplicates on re-run
  const { error: deleteError } = await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Failed to clear existing questions:', deleteError.message)
    process.exit(1)
  }

  const { error } = await supabase.from('quiz_questions').insert(questions)

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log('Done.')
}

seed()
