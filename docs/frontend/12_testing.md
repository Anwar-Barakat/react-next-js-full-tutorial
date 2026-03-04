# Testing Guide

A guide to JavaScript testing with Jest and React Testing Library.

## Table of Contents

1. [What is testing and why test?](#1-what-is-testing-and-why-test)
2. [Types of tests](#2-types-of-tests)
3. [What is Jest?](#3-what-is-jest)
4. [Basic test structure and matchers](#4-basic-test-structure-and-matchers)
5. [Setup and teardown](#5-setup-and-teardown)
6. [Mocking in Jest](#6-mocking-in-jest)
7. [Testing async code](#7-testing-async-code)
8. [What is React Testing Library?](#8-what-is-react-testing-library)
9. [RTL queries: getBy, queryBy, findBy](#9-rtl-queries-getby-queryby-findby)
10. [Testing a React component](#10-testing-a-react-component)
11. [fireEvent vs userEvent](#11-fireevent-vs-userevent)
12. [Testing forms](#12-testing-forms)
13. [Testing async operations in RTL](#13-testing-async-operations-in-rtl)
14. [Testing custom hooks](#14-testing-custom-hooks)
15. [Testing with Context, Redux, and Router](#15-testing-with-context-redux-and-router)
16. [Snapshot testing and code coverage](#16-snapshot-testing-and-code-coverage)
17. [Best practices](#17-best-practices)

---

## 1. What is testing and why test?

- Testing verifies that your code works correctly.
- Catches bugs before users encounter them.
- Makes refactoring safer.
- Serves as documentation for how code should behave.

---

## 2. Types of tests

- **Unit Tests:** Test individual functions or components in isolation. Fast and most common.
- **End-to-End (E2E) Tests:** Test complete user flows. Slowest but most realistic.
- **Snapshot Tests:** Capture component output and compare on future runs.

---

## 3. What is Jest?

- A JavaScript testing framework by Meta.
- Works with React, Vue, Node.js, TypeScript.
- Zero configuration needed.
- Built-in mocking, coverage, and assertions.

---

## 4. Basic test structure and matchers

- `describe`: Groups related tests.
- `test` / `it`: Individual test case.
- `expect`: Makes assertions.

```javascript
describe('Math operations', () => {
  test('adds two numbers', () => {
    expect(2 + 3).toBe(5);
  });
});
```

Common matchers:

- `toBe()` — exact equality (`===`), checks same reference
- `toEqual()` — deep equality (for objects/arrays)
- `toBeNull()` / `toBeUndefined()` / `toBeTruthy()` / `toBeFalsy()`
- `toContain()` — array/string contains value
- `toThrow()` — function throws error
- `not` — negation: `expect(x).not.toBe(5)`

```javascript
// toBe vs toEqual
const user1 = { name: 'Anwar' };
const user2 = { name: 'Anwar' };

expect(user1).toBe(user1);      // same reference
expect(user1).toEqual(user2);   // same values

expect([1, 2, 3]).toContain(2);
expect(10).toBeGreaterThan(5);
expect(() => { throw new Error('Failed'); }).toThrow('Failed');
```

---

## 5. Setup and teardown

- `beforeEach()` / `afterEach()` — runs before/after each test
- `beforeAll()` / `afterAll()` — runs once before/after all tests

```javascript
describe('Database tests', () => {
  let db;

  beforeAll(() => { db = connectToDatabase(); });
  beforeEach(() => { db.clear(); });
  afterAll(() => { db.disconnect(); });

  test('saves user', () => {
    db.save({ name: 'Anwar' });
    expect(db.users).toHaveLength(1);
  });
});
```

---

## 6. Mocking in Jest

- `jest.fn()` — creates a mock function
- `jest.mock()` — mocks entire module
- `jest.spyOn()` — spies on existing method

```javascript
// jest.fn()
const mockFn = jest.fn().mockReturnValue(10);
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// jest.mock() - Mock entire module
jest.mock('./api');
import { fetchUser } from './api';
fetchUser.mockResolvedValue({ name: 'Anwar' });

// jest.spyOn()
const spy = jest.spyOn(user, 'getName');
user.getName();
expect(spy).toHaveBeenCalled();
spy.mockRestore();
```

---

## 7. Testing async code

```javascript
// async/await (recommended)
test('fetches user data', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Anwar');
});

// Testing rejections
test('fails to fetch user', async () => {
  await expect(fetchUser(999)).rejects.toThrow('Not found');
});
```

---

## 8. What is React Testing Library?

- A library for testing React components.
- Focuses on testing user behavior, not implementation details.
- Philosophy: "Test how users interact with your app."
- Recommended by the React team over Enzyme (which is deprecated).

---

## 9. RTL queries: getBy, queryBy, findBy

- `getBy*` — throws if not found. Use for elements that should exist.
- `queryBy*` — returns null if not found. Use to check element doesn't exist.
- `findBy*` — async, waits for element. Use for elements that appear after loading.

```javascript
import { render, screen } from '@testing-library/react';

// getBy - element must exist
const button = screen.getByRole('button');
const heading = screen.getByText('Welcome');
const input = screen.getByLabelText('Username');

// queryBy - check element doesn't exist
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// findBy - wait for async element
const message = await screen.findByText('Loaded');

// *AllBy* - returns array
const items = screen.getAllByRole('listitem');
expect(items).toHaveLength(3);
```

---

## 10. Testing a React component

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

describe('Counter', () => {
  test('renders initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments on click', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

---

## 11. fireEvent vs userEvent

- `fireEvent` — dispatches a single DOM event (low-level).
- `userEvent` — simulates real user interactions (recommended).

```javascript
// fireEvent - single event
fireEvent.change(input, { target: { value: 'Hello' } });

// userEvent - realistic typing (better)
const user = userEvent.setup();
await user.type(input, 'Hello');

// userEvent triggers all related events
await user.click(button); // hover → mousedown → mouseup → click
fireEvent.click(button);  // only click
```

- Always prefer `userEvent` over `fireEvent`.

---

## 12. Testing forms

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form with user data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Username'), 'anwar');
  await user.type(screen.getByLabelText('Password'), 'pass123');
  await user.click(screen.getByRole('button', { name: 'Login' }));

  expect(onSubmit).toHaveBeenCalledWith({
    username: 'anwar',
    password: 'pass123'
  });
});
```

---

## 13. Testing async operations in RTL

```javascript
jest.mock('./api');
import { fetchUser } from './api';

test('loads and displays user', async () => {
  fetchUser.mockResolvedValue({ name: 'Anwar' });
  render(<UserProfile userId={1} />);

  // Initially loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for data
  expect(await screen.findByText('Anwar')).toBeInTheDocument();

  // Loading gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
```

---

## 14. Testing custom hooks

```javascript
import { renderHook, act } from '@testing-library/react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  return { count, increment };
}

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);

  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(6);
});
```

---

## 15. Testing with Context, Redux, and Router

**Context:**

```javascript
function renderWithTheme(ui, { theme = { color: 'blue' } } = {}) {
  return render(
    <ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>
  );
}

test('renders with theme', () => {
  renderWithTheme(<ThemedButton />, { theme: { color: 'red' } });
  expect(screen.getByRole('button')).toHaveStyle({ color: 'red' });
});
```

**Redux:**

```javascript
function renderWithRedux(ui, { preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

test('displays user from Redux', () => {
  renderWithRedux(<UserGreeting />, {
    preloadedState: { user: { name: 'Anwar' } }
  });
  expect(screen.getByText('Hello, Anwar')).toBeInTheDocument();
});
```

**React Router:**

```javascript
test('navigates to about page', async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );

  await user.click(screen.getByText('About'));
  expect(screen.getByText('About Page')).toBeInTheDocument();
});
```

---

## 16. Snapshot testing and code coverage

**Snapshot Testing:**

```javascript
test('matches snapshot', () => {
  const { container } = render(<Button label="Click me" />);
  expect(container).toMatchSnapshot();
});
// Update snapshots with: jest -u
```

- Use sparingly — behavior tests are more valuable.

**Code Coverage:**

```bash
npm test -- --coverage
```

- Measures which lines/branches/functions are tested.
- Aim for 70-80% coverage.
- Good coverage doesn't guarantee good tests.

---

## 17. Best practices

- Test user behavior, not implementation details.
- Use the AAA pattern: **A**rrange → **A**ct → **A**ssert.
- Write clear test names: `'displays error when login fails'`.
- Prefer accessible queries: `getByRole`, `getByLabelText` over `getByTestId`.
- Test one thing per test.
- Mock external dependencies, not internal logic.
- Use `screen.debug()` to debug failing tests.
- Use `screen.logTestingPlaygroundURL()` for query suggestions.

**What to test:**
- User interactions (clicks, typing, form submission)
- Conditional rendering
- API calls and error handling
- Edge cases

**What NOT to test:**
- Third-party libraries
- Implementation details (internal state)
- CSS styling (unless critical)

**TDD (Test-Driven Development):**
- Write test first (Red) → Write code to pass (Green) → Refactor
