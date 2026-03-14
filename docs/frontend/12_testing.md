# Testing Guide

A guide to JavaScript testing with Jest and React Testing Library.

---

## 1. Overview

**Why test:** Catches bugs early, makes refactoring safer, documents expected behavior.

**Test types:**
- **Unit** — test individual functions/components in isolation. Fast, most common.
- **E2E** — test complete user flows. Slow but realistic.
- **Snapshot** — capture component output and compare on future runs.

**Jest** is a zero-config testing framework with built-in mocking, coverage, and assertions.

---

## 2. Basic Test Structure and Matchers

```javascript
describe('Math operations', () => {
  test('adds two numbers', () => {
    expect(2 + 3).toBe(5);
  });
});
```

Common matchers: `toBe()`, `toEqual()`, `toBeNull()`, `toBeTruthy()`, `toBeFalsy()`, `toContain()`, `toThrow()`, `not`

- `toBe()` — exact equality (`===`)
- `toEqual()` — deep equality (objects/arrays)

```javascript
expect({ name: 'Anwar' }).toEqual({ name: 'Anwar' });
expect([1, 2, 3]).toContain(2);
expect(() => { throw new Error('Failed'); }).toThrow('Failed');
```

---

## 3. Setup and Teardown

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

## 4. Mocking

```javascript
// jest.fn()
const mockFn = jest.fn().mockReturnValue(10);
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// jest.mock()
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

## 5. Testing Async Code

```javascript
test('fetches user data', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Anwar');
});

test('fails to fetch user', async () => {
  await expect(fetchUser(999)).rejects.toThrow('Not found');
});
```

---

## 6. RTL Queries

**React Testing Library** tests user behavior, not implementation details.

- `getBy*` — throws if not found. Use when element must exist.
- `queryBy*` — returns null if not found. Use to assert absence.
- `findBy*` — async, waits for element. Use for elements that appear after loading.

```javascript
screen.getByRole('button');
screen.getByLabelText('Username');
expect(screen.queryByText('Error')).not.toBeInTheDocument();
const message = await screen.findByText('Loaded');
```

---

## 7. Testing a React Component

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

Always prefer `userEvent` over `fireEvent` — it simulates real interactions rather than dispatching a single DOM event.

---

## 8. Testing Forms and Async Operations

```javascript
test('submits form with user data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('Username'), 'anwar');
  await user.type(screen.getByLabelText('Password'), 'pass123');
  await user.click(screen.getByRole('button', { name: 'Login' }));

  expect(onSubmit).toHaveBeenCalledWith({ username: 'anwar', password: 'pass123' });
});

test('loads and displays user', async () => {
  fetchUser.mockResolvedValue({ name: 'Anwar' });
  render(<UserProfile userId={1} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(await screen.findByText('Anwar')).toBeInTheDocument();
});
```

---

## 9. Testing Custom Hooks

```javascript
import { renderHook, act } from '@testing-library/react';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(5));
  expect(result.current.count).toBe(5);

  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(6);
});
```

---

## 10. Testing with Context, Redux, and Router

```javascript
// Context
function renderWithTheme(ui, { theme = { color: 'blue' } } = {}) {
  return render(<ThemeContext.Provider value={theme}>{ui}</ThemeContext.Provider>);
}

// Redux
function renderWithRedux(ui, { preloadedState = {} } = {}) {
  const store = configureStore({ reducer: { user: userReducer }, preloadedState });
  return render(<Provider store={store}>{ui}</Provider>);
}

// Router
render(
  <MemoryRouter initialEntries={['/']}>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </MemoryRouter>
);
```

---

## 11. Snapshots and Coverage

```javascript
test('matches snapshot', () => {
  const { container } = render(<Button label="Click me" />);
  expect(container).toMatchSnapshot();
});
// Update snapshots: jest -u
```

```bash
npm test -- --coverage
```

Aim for 70–80% coverage. Use snapshots sparingly — behavior tests are more valuable.

---

## 12. Best Practices

- Test user behavior, not implementation details.
- Use the AAA pattern: **Arrange → Act → Assert**.
- Prefer accessible queries: `getByRole`, `getByLabelText` over `getByTestId`.
- One assertion focus per test.
- Mock external dependencies, not internal logic.
- Use `screen.debug()` to inspect the DOM when tests fail.

**Test:** user interactions, conditional rendering, API calls, error handling, edge cases.

**Don't test:** third-party libraries, internal state, CSS styling.
