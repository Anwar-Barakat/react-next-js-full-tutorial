01. What is testing and why test?

🟣 Testing is the process of verifying that your code works correctly.
🟣 Helps catch bugs before users encounter them.
🟣 Makes refactoring safer and easier.
🟣 Serves as documentation for how code should behave.
🟣 Increases confidence when shipping code.
🟣 Reduces debugging time in production.

-----------------------------------------

02. What are the different types of tests?

🟣 Unit Tests: Test individual functions or components in isolation.
   ▫️ Fast and focused.
   ▫️ Most common type.
   ▫️ Example: Testing a single function or component.
🟣 End-to-End (E2E) Tests: Test complete user flows.
   ▫️ Slowest but most realistic.
   ▫️ Test entire application.
   ▫️ Example: Full user journey from login to checkout.
🟣 Snapshot Tests: Capture component output and compare on future runs.
   ▫️ Detect unexpected UI changes.
   ▫️ Common with Jest.

-----------------------------------------

03. What is Jest?

🟣 Jest is a JavaScript testing framework.
🟣 Developed by Facebook (Meta).
🟣 Works with React, Vue, Node.js, TypeScript.
🟣 Zero configuration needed.
🟣 Built-in features: mocking, coverage, assertions.
🟣 Fast parallel test execution.

-----------------------------------------

05. What is the basic structure of a Jest test?

🟣 Tests are organized using describe and test/it blocks.
🟣 describe: Groups related tests together.
🟣 test/it: Individual test case.
🟣 expect: Makes assertions.

************* 🟣🟣🟣 *************
// Basic test structure
describe('Math operations', () => {
  test('adds two numbers', () => {
    const result = 2 + 3;
    expect(result).toBe(5);
  });

  it('multiplies two numbers', () => {
    const result = 2 * 3;
    expect(result).toBe(6);
  });
});

// test and it are the same
// Use whichever reads better
************* 🟣🟣🟣 *************

-----------------------------------------

06. What are Jest matchers?

🟣 Matchers are methods to test values in different ways.
🟣 Common matchers:
   ▫️ toBe(): Exact equality (===)
   ▫️ toEqual(): Deep equality (for objects/arrays)
   ▫️ toBeNull(): Check if null
   ▫️ toBeUndefined(): Check if undefined
   ▫️ toBeTruthy() / toBeFalsy(): Truthy/falsy check
   ▫️ toContain(): Array/string contains value
   ▫️ toThrow(): Function throws error

************* 🟣🟣🟣 *************
// Equality
expect(2 + 2).toBe(4);
expect({ name: 'Anwar' }).toEqual({ name: 'Anwar' });

// Null and undefined
expect(null).toBeNull();
expect(undefined).toBeUndefined();

// Truthiness
expect(1).toBeTruthy();
expect(0).toBeFalsy();

// Arrays and strings
expect([1, 2, 3]).toContain(2);
expect('Hello World').toContain('World');

// Numbers
expect(10).toBeGreaterThan(5);
expect(5).toBeLessThan(10);

// Errors
expect(() => {
  throw new Error('Failed');
}).toThrow('Failed');

// Not matcher
expect(2 + 2).not.toBe(5);
************* 🟣🟣🟣 *************

-----------------------------------------

07. What is the difference between toBe and toEqual?

🟣 toBe: Uses === (strict equality), checks same reference.
🟣 toEqual: Checks deep equality (values inside objects/arrays).

************* 🟣🟣🟣 *************
// Primitives - both work the same
expect(5).toBe(5);
expect(5).toEqual(5);

// Objects - different behavior
const user1 = { name: 'Anwar' };
const user2 = { name: 'Anwar' };

expect(user1).toBe(user1); // ✅ Same reference
expect(user1).toBe(user2); // ❌ Different references

expect(user1).toEqual(user2); // ✅ Same values

// Arrays
expect([1, 2, 3]).toEqual([1, 2, 3]); // ✅
expect([1, 2, 3]).toBe([1, 2, 3]); // ❌
************* 🟣🟣🟣 *************

-----------------------------------------

08. What are setup and teardown methods in Jest?

🟣 Setup: Code that runs before tests.
🟣 Teardown: Code that runs after tests.
🟣 Methods:
   ▫️ beforeEach(): Runs before each test
   ▫️ afterEach(): Runs after each test
   ▫️ beforeAll(): Runs once before all tests
   ▫️ afterAll(): Runs once after all tests

************* 🟣🟣🟣 *************
describe('Database tests', () => {
  let db;

  // Runs once before all tests
  beforeAll(() => {
    db = connectToDatabase();
  });

  // Runs before each test
  beforeEach(() => {
    db.clear();
  });

  // Runs after each test
  afterEach(() => {
    db.resetMocks();
  });

  // Runs once after all tests
  afterAll(() => {
    db.disconnect();
  });

  test('saves user', () => {
    db.save({ name: 'Anwar' });
    expect(db.users).toHaveLength(1);
  });

  test('deletes user', () => {
    db.save({ name: 'Anwar' });
    db.delete(1);
    expect(db.users).toHaveLength(0);
  });
});
************* 🟣🟣🟣 *************

-----------------------------------------

09. What is mocking in Jest?

🟣 Mocking replaces real functions/modules with fake versions.
🟣 Allows testing in isolation without dependencies.
🟣 Control function behavior and return values.
🟣 Track how functions are called.

************* 🟣🟣🟣 *************
// Mock a function
const mockFn = jest.fn();
mockFn('hello');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock with return value
const add = jest.fn().mockReturnValue(10);
expect(add(2, 3)).toBe(10);

// Mock different return values
const getValue = jest.fn()
  .mockReturnValueOnce(1)
  .mockReturnValueOnce(2)
  .mockReturnValue(3);

console.log(getValue()); // 1
console.log(getValue()); // 2
console.log(getValue()); // 3

// Mock async functions
const fetchUser = jest.fn().mockResolvedValue({ name: 'Anwar' });
const user = await fetchUser();
expect(user.name).toBe('Anwar');
************* 🟣🟣🟣 *************

-----------------------------------------

10. What is jest.fn(), jest.mock(), and jest.spyOn()?

🟣 jest.fn(): Creates a mock function.
🟣 jest.mock(): Mocks entire module.
🟣 jest.spyOn(): Spies on existing method.

************* 🟣🟣🟣 *************
// jest.fn() - Create mock function
const mockCallback = jest.fn((x) => x + 1);
[1, 2, 3].forEach(mockCallback);
expect(mockCallback).toHaveBeenCalledTimes(3);

// jest.mock() - Mock entire module
jest.mock('./api');
import { fetchUser } from './api';
fetchUser.mockResolvedValue({ name: 'Anwar' });

// jest.spyOn() - Spy on existing method
const user = {
  getName: () => 'Anwar'
};
const spy = jest.spyOn(user, 'getName');
user.getName();
expect(spy).toHaveBeenCalled();
spy.mockRestore(); // Restore original
************* 🟣🟣🟣 *************

-----------------------------------------

11. How do you test async code in Jest?

🟣 Three ways to test async code:
   ▫️ async/await (recommended)
   ▫️ Promises with return
   ▫️ Callbacks with done

************* 🟣🟣🟣 *************
// Method 1: async/await (best)
test('fetches user data', async () => {
  const data = await fetchUser(1);
  expect(data.name).toBe('Anwar');
});

// Method 2: Return promise
test('fetches user data', () => {
  return fetchUser(1).then((data) => {
    expect(data.name).toBe('Anwar');
  });
});

// Method 3: Callbacks with done
test('fetches user data', (done) => {
  fetchUser(1, (data) => {
    expect(data.name).toBe('Anwar');
    done();
  });
});

// Testing rejections
test('fails to fetch user', async () => {
  await expect(fetchUser(999)).rejects.toThrow('Not found');
});
************* 🟣🟣🟣 *************

-----------------------------------------

12. What is React Testing Library (RTL)?

🟣 A library for testing React components.
🟣 Focuses on testing user behavior, not implementation.
🟣 Encourages accessible and maintainable tests.
🟣 Built on top of DOM Testing Library.
🟣 Philosophy: "Test how users interact with your app."

-----------------------------------------

13. What is the difference between React Testing Library and Enzyme?

🟣 RTL: Tests user behavior (what users see/do).
🟣 Enzyme: Tests implementation details (internal state/methods).
🟣 RTL encourages better testing practices.
🟣 RTL is recommended by React team.
🟣 Enzyme is deprecated and less maintained.

-----------------------------------------

14. What are the main RTL queries?

🟣 Queries find elements on the page.
🟣 Three types: getBy, queryBy, findBy.
🟣 Each has variants: ByRole, ByText, ByLabelText, etc.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';

// getBy* - Throws error if not found (most common)
const button = screen.getByRole('button');
const heading = screen.getByText('Welcome');
const input = screen.getByLabelText('Username');

// queryBy* - Returns null if not found (for checking non-existence)
const error = screen.queryByText('Error');
expect(error).not.toBeInTheDocument();

// findBy* - Async, waits for element (for async content)
const message = await screen.findByText('Loaded');

// *AllBy* - Returns array of elements
const items = screen.getAllByRole('listitem');
expect(items).toHaveLength(3);
************* 🟣🟣🟣 *************

-----------------------------------------

15. What is the difference between getBy, queryBy, and findBy?

🟣 getBy*: Throws error if element not found. Use for elements that should exist.
🟣 queryBy*: Returns null if not found. Use to check element doesn't exist.
🟣 findBy*: Async, waits for element. Use for elements that appear after loading.

************* 🟣🟣🟣 *************
// getBy - Element must exist
const button = screen.getByRole('button'); // ❌ Throws if missing

// queryBy - Check element doesn't exist
const error = screen.queryByText('Error');
expect(error).not.toBeInTheDocument(); // ✅ null is ok

// findBy - Wait for async element
const data = await screen.findByText('Loaded'); // ✅ Waits up to 1s
************* 🟣🟣🟣 *************

-----------------------------------------

16. How do you test a React component with RTL?

🟣 Use render() to render component.
🟣 Use screen to query elements.
🟣 Use user interactions to test behavior.
🟣 Use expect() for assertions.

************* 🟣🟣🟣 *************
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

  test('increments count on button click', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: 'Increment' });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
************* 🟣🟣🟣 *************

-----------------------------------------

17. What is the difference between fireEvent and userEvent?

🟣 fireEvent: Dispatches DOM events directly (low-level).
🟣 userEvent: Simulates real user interactions (high-level, recommended).
🟣 userEvent is more realistic and triggers all related events.

************* 🟣🟣🟣 *************
import { fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// fireEvent - dispatches single event
const input = screen.getByRole('textbox');
fireEvent.change(input, { target: { value: 'Hello' } });

// userEvent - simulates real typing (better)
const user = userEvent.setup();
await user.type(input, 'Hello'); // Types each character

// userEvent triggers more realistic events
await user.click(button); // hover → mousedown → mouseup → click
fireEvent.click(button); // Only click event
************* 🟣🟣🟣 *************

🟣 Always prefer userEvent over fireEvent.

-----------------------------------------

18. How do you test forms with RTL?

🟣 Find input elements.
🟣 Simulate user input.
🟣 Submit form.
🟣 Assert results.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function LoginForm({ onSubmit }) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      onSubmit({
        username: formData.get('username'),
        password: formData.get('password')
      });
    }}>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" />
      
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" />
      
      <button type="submit">Login</button>
    </form>
  );
}

test('submits form with user data', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<LoginForm onSubmit={onSubmit} />);
  
  // Fill form
  await user.type(screen.getByLabelText('Username'), 'anwar');
  await user.type(screen.getByLabelText('Password'), 'pass123');
  
  // Submit
  await user.click(screen.getByRole('button', { name: 'Login' }));
  
  // Assert
  expect(onSubmit).toHaveBeenCalledWith({
    username: 'anwar',
    password: 'pass123'
  });
});
************* 🟣🟣🟣 *************

-----------------------------------------

19. How do you test async operations in RTL?

🟣 Use findBy queries (async).
🟣 Use waitFor for custom waiting.
🟣 Mock API calls.

************* 🟣🟣🟣 *************
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  return <p>{user.name}</p>;
}

// Mock API
jest.mock('./api');
import { fetchUser } from './api';

test('loads and displays user', async () => {
  fetchUser.mockResolvedValue({ name: 'Anwar' });
  
  render(<UserProfile userId={1} />);
  
  // Initially loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for user to load (findBy is async)
  expect(await screen.findByText('Anwar')).toBeInTheDocument();
  
  // Loading should be gone
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

// Using waitFor for custom conditions
test('displays error message', async () => {
  fetchUser.mockRejectedValue(new Error('Failed'));
  
  render(<UserProfile userId={1} />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading user')).toBeInTheDocument();
  });
});
************* 🟣🟣🟣 *************

-----------------------------------------

20. How do you test custom hooks?

🟣 Use renderHook from RTL.
🟣 Access hook result.
🟣 Test hook behavior.

************* 🟣🟣🟣 *************
import { renderHook, act } from '@testing-library/react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return { count, increment, decrement };
}

test('useCounter increments and decrements', () => {
  const { result } = renderHook(() => useCounter(5));
  
  // Initial value
  expect(result.current.count).toBe(5);
  
  // Increment
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(6);
  
  // Decrement
  act(() => {
    result.current.decrement();
  });
  expect(result.current.count).toBe(5);
});

// Test hook with props
test('useCounter with different initial value', () => {
  const { result, rerender } = renderHook(
    ({ initial }) => useCounter(initial),
    { initialProps: { initial: 10 } }
  );
  
  expect(result.current.count).toBe(10);
  
  // Change props
  rerender({ initial: 20 });
  expect(result.current.count).toBe(20);
});
************* 🟣🟣🟣 *************

-----------------------------------------

21. How do you test components with Context?

🟣 Wrap component with context provider.
🟣 Pass test values through context.
🟣 Create custom render function.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';

const ThemeContext = createContext();

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button style={{ color: theme.color }}>Click me</button>;
}

// Method 1: Wrap manually
test('renders with theme', () => {
  render(
    <ThemeContext.Provider value={{ color: 'red' }}>
      <ThemedButton />
    </ThemeContext.Provider>
  );
  
  const button = screen.getByRole('button');
  expect(button).toHaveStyle({ color: 'red' });
});

// Method 2: Custom render function (reusable)
function renderWithTheme(ui, { theme = { color: 'blue' }, ...options } = {}) {
  return render(
    <ThemeContext.Provider value={theme}>
      {ui}
    </ThemeContext.Provider>,
    options
  );
}

test('renders with custom theme', () => {
  renderWithTheme(<ThemedButton />, { theme: { color: 'green' } });
  
  const button = screen.getByRole('button');
  expect(button).toHaveStyle({ color: 'green' });
});
************* 🟣🟣🟣 *************

-----------------------------------------

22. How do you test components with Redux?

🟣 Wrap component with Redux Provider.
🟣 Create test store with initial state.
🟣 Test component behavior with store.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

function UserGreeting() {
  const user = useSelector((state) => state.user.name);
  return <h1>Hello, {user}</h1>;
}

// Create test store
function renderWithRedux(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { user: userReducer },
      preloadedState
    }),
    ...options
  } = {}
) {
  return render(<Provider store={store}>{ui}</Provider>, options);
}

test('displays user name from Redux', () => {
  renderWithRedux(<UserGreeting />, {
    preloadedState: {
      user: { name: 'Anwar' }
    }
  });
  
  expect(screen.getByText('Hello, Anwar')).toBeInTheDocument();
});

// Test dispatch
test('updates user on action', async () => {
  const user = userEvent.setup();
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: { name: 'Anwar' } }
  });
  
  render(
    <Provider store={store}>
      <UserProfile />
    </Provider>
  );
  
  await user.click(screen.getByRole('button', { name: 'Update Name' }));
  expect(store.getState().user.name).toBe('Sara');
});
************* 🟣🟣🟣 *************

-----------------------------------------

23. How do you test React Router components?

🟣 Wrap component with Router.
🟣 Use MemoryRouter for testing.
🟣 Test navigation and route changes.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/about">About</Link>
    </div>
  );
}

function About() {
  return <h1>About</h1>;
}

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
  
  expect(screen.getByText('Home')).toBeInTheDocument();
  
  await user.click(screen.getByText('About'));
  
  expect(screen.getByText('About')).toBeInTheDocument();
});

// Test with route params
test('displays user by id', () => {
  render(
    <MemoryRouter initialEntries={['/user/123']}>
      <Routes>
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(screen.getByText('User ID: 123')).toBeInTheDocument();
});
************* 🟣🟣🟣 *************

-----------------------------------------

24. What is snapshot testing?

🟣 Snapshot testing captures component output and saves it.
🟣 Future runs compare against saved snapshot.
🟣 Detects unexpected changes in UI.
🟣 Common for testing component rendering.

************* 🟣🟣🟣 *************
import { render } from '@testing-library/react';

function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

test('matches snapshot', () => {
  const { container } = render(<Button label="Click me" />);
  expect(container).toMatchSnapshot();
});

// First run: creates snapshot file
// Future runs: compares against saved snapshot

// Update snapshots with: jest -u
************* 🟣🟣🟣 *************

🟣 Pros: Fast, catches unintended changes.
🟣 Cons: Can be noisy, doesn't test behavior.
🟣 Use sparingly, focus on behavior tests.

-----------------------------------------

25. What is code coverage?

🟣 Code coverage measures how much code is tested.
🟣 Shows which lines/branches/functions are covered.
🟣 Helps identify untested code.
🟣 Run with: jest --coverage

************* 🟣🟣🟣 *************
// Coverage metrics:
// - Statements: % of statements executed
// - Branches: % of if/else branches tested
// - Functions: % of functions called
// - Lines: % of lines executed

// Run coverage
npm test -- --coverage

// Coverage report shows:
File         | % Stmts | % Branch | % Funcs | % Lines
-------------|---------|----------|---------|--------
Button.js    |   100   |   100    |   100   |   100
Form.js      |   80    |   75     |   90    |   82
************* 🟣🟣🟣 *************

🟣 Good coverage doesn't guarantee good tests.
🟣 Aim for 70-80% coverage.
🟣 Focus on critical code paths.

-----------------------------------------

26. What should you test vs not test?

🟣 DO TEST:
   ▫️ User interactions (clicks, typing, form submission)
   ▫️ Conditional rendering
   ▫️ API calls and data fetching
   ▫️ Error handling
   ▫️ Edge cases
   ▫️ Accessibility

🟣 DON'T TEST:
   ▫️ Third-party libraries
   ▫️ Implementation details
   ▫️ Internal state directly
   ▫️ CSS styling (unless critical)
   ▫️ Browser APIs

************* 🟣🟣🟣 *************
// ✅ Good - Tests user behavior
test('shows error on invalid email', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  await user.type(screen.getByLabelText('Email'), 'invalid');
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});

// ❌ Bad - Tests implementation detail
test('updates state on input change', () => {
  const { rerender } = render(<LoginForm />);
  // Testing internal state directly
  expect(wrapper.state('email')).toBe('');
});
************* 🟣🟣🟣 *************

-----------------------------------------

27. What is the AAA pattern in testing?

🟣 AAA stands for Arrange, Act, Assert.
🟣 A testing pattern that organizes test structure.
🟣 Makes tests clear and readable.

************* 🟣🟣🟣 *************
test('increments counter on button click', async () => {
  // Arrange - Set up test data and render
  const user = userEvent.setup();
  render(<Counter initialCount={5} />);
  
  // Act - Perform action
  const button = screen.getByRole('button', { name: 'Increment' });
  await user.click(button);
  
  // Assert - Check result
  expect(screen.getByText('Count: 6')).toBeInTheDocument();
});
************* 🟣🟣🟣 *************

-----------------------------------------

28. What are testing best practices?

🟣 Test user behavior, not implementation.
🟣 Write clear test names.
🟣 Keep tests isolated and independent.
🟣 Use data-testid sparingly (prefer accessible queries).
🟣 Mock external dependencies.
🟣 Test one thing per test.
🟣 Avoid testing internal state.
🟣 Use meaningful assertions.
🟣 Keep tests fast.

************* 🟣🟣🟣 *************
// ✅ Good test name
test('displays error message when login fails', () => {});

// ❌ Bad test name
test('test1', () => {});

// ✅ Good query (accessible)
screen.getByRole('button', { name: 'Submit' });

// ❌ Bad query (not accessible)
screen.getByTestId('submit-btn');

// ✅ Test behavior
expect(screen.getByText('Success!')).toBeInTheDocument();

// ❌ Test implementation
expect(component.state.showSuccess).toBe(true);
************* 🟣🟣🟣 *************

-----------------------------------------

29. How do you debug failing tests?

🟣 Use screen.debug() to print DOM.
🟣 Use screen.logTestingPlaygroundURL() for query suggestions.
🟣 Add --verbose flag for detailed output.
🟣 Use console.log() to inspect values.
🟣 Check test output carefully.

************* 🟣🟣🟣 *************
import { render, screen } from '@testing-library/react';

test('debugging example', () => {
  render(<MyComponent />);
  
  // Print entire DOM
  screen.debug();
  
  // Print specific element
  screen.debug(screen.getByRole('button'));
  
  // Get query suggestions
  screen.logTestingPlaygroundURL();
  
  // Check what's rendered
  console.log(screen.getByRole('button').textContent);
});
************* 🟣🟣🟣 *************

-----------------------------------------

30. What is TDD (Test-Driven Development)?

🟣 TDD is a development approach where you write tests first.
🟣 Process: Red → Green → Refactor
   ▫️ Red: Write failing test
   ▫️ Green: Write minimum code to pass
   ▫️ Refactor: Improve code without breaking tests

************* 🟣🟣🟣 *************
// 1. Write test first (RED)
test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5); // Fails - add() doesn't exist
});

// 2. Write minimum code to pass (GREEN)
function add(a, b) {
  return a + b;
}

// 3. Refactor (if needed)
function add(a, b) {
  return Number(a) + Number(b); // Handle strings
}
************* 🟣🟣🟣 *************

🟣 Benefits: Better design, full coverage, confidence.
🟣 Challenges: Takes time, requires discipline.

-----------------------------------------