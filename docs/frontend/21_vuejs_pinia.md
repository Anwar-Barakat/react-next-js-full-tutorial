# Vue.js & Pinia Guide

A guide to Vue.js core concepts and Pinia state management for developers who already know React.

---

## Table of Contents

1. [What is Vue.js?](#1-what-is-vuejs)
2. [Vue Project Setup](#2-vue-project-setup)
3. [Template Syntax](#3-template-syntax)
4. [Reactivity (ref and reactive)](#4-reactivity-ref-and-reactive)
5. [Directives](#5-directives)
6. [Components](#6-components)
7. [Lifecycle Hooks](#7-lifecycle-hooks)
8. [Vue Router](#8-vue-router)
9. [Composables (Custom Hooks)](#9-composables-custom-hooks)
10. [What is Pinia?](#10-what-is-pinia)
11. [Creating a Pinia Store](#11-creating-a-pinia-store)
12. [Using Pinia in Components](#12-using-pinia-in-components)
13. [Pinia with Async Actions](#13-pinia-with-async-actions)
14. [Pinia Plugins and Persistence](#14-pinia-plugins-and-persistence)
15. [Vue vs React Quick Reference](#15-vue-vs-react-quick-reference)

---

## 1. What is Vue.js?

- Vue.js is a **progressive JavaScript framework** for building user interfaces.
- Created by **Evan You**.
- Can be used for small widgets or full single-page applications.
- Two API styles: **Options API** (Vue 2 style) and **Composition API** (Vue 3, recommended).
- Uses a **Virtual DOM** like React.
- **Reactive data system** — when data changes, the UI updates automatically.

**Vue vs React:**

- Vue uses templates (HTML-based), React uses JSX
- Vue has built-in directives (`v-if`, `v-for`, `v-model`), React uses JavaScript expressions
- Vue has built-in state management (`reactive`/`ref`), React uses `useState`
- Vue has built-in two-way binding (`v-model`), React is one-way by default
- Both use component-based architecture
- Both use Virtual DOM
- Both have CLI tools (`create-vue` / `create-react-app`/Vite)

---

## 2. Vue Project Setup

**Using create-vue (Vite-based, recommended):**

```bash
npm create vue@latest
cd my-project
npm install
npm run dev
```

**Project structure:**

- `src/App.vue` — root component
- `src/main.ts` — entry point
- `src/components/` — reusable components
- `src/views/` — page-level components
- `src/router/` — Vue Router config
- `src/stores/` — Pinia stores

**Single File Component (SFC) structure:**

Every `.vue` file has three sections: `<script setup>`, `<template>`, and `<style scoped>`.

```html
<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello Vue!');
</script>

<template>
  <h1>{{ message }}</h1>
</template>

<style scoped>
h1 {
  color: green;
}
</style>
```

---

## 3. Template Syntax

- **Text interpolation:** `{{ message }}`
- **Raw HTML:** `v-html="rawHtml"` (be careful with XSS)
- **Attribute binding:** `:href="url"` (shorthand for `v-bind:href`)
- **Dynamic attributes:** `:[attrName]="value"`
- **JavaScript expressions in templates:** `{{ count + 1 }}`, `{{ ok ? 'Yes' : 'No' }}`
- **Class binding:** `:class="{ active: isActive }"` and `:class="[classA, classB]"`
- **Style binding:** `:style="{ color: textColor, fontSize: size + 'px' }"`

```html
<template>
  <h1>{{ title }}</h1>
  <a :href="url">{{ linkText }}</a>
  <p :class="{ active: isActive, error: hasError }">Status</p>
  <p :style="{ color: textColor }">Styled text</p>
</template>
```

---

## 4. Reactivity (ref and reactive)

- `ref()` — for primitive values (string, number, boolean). Access with `.value` in script, direct in template.
- `reactive()` — for objects and arrays. No `.value` needed.
- `computed()` — derived values that auto-update when dependencies change (like `useMemo` in React).
- `watch()` — run side effects when data changes (like `useEffect` in React).
- `watchEffect()` — automatically tracks dependencies and re-runs.

```typescript
<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect } from 'vue';

// ref for primitives
const count = ref(0);
const name = ref('Anwar');

// reactive for objects
const user = reactive({
  name: 'Anwar',
  age: 25,
});

// computed
const doubleCount = computed(() => count.value * 2);

// watch
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`);
});

// watchEffect - auto-tracks dependencies
watchEffect(() => {
  console.log(`Name is: ${name.value}`);
});
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Double: {{ doubleCount }}</p>
  <button @click="count++">Increment</button>
</template>
```

---

## 5. Directives

- `v-if` / `v-else-if` / `v-else` — conditional rendering (removes from DOM)
- `v-show` — toggle visibility with CSS (stays in DOM)
- `v-for` — loop over arrays/objects. Always use `:key`
- `v-on` or `@` — event handling (`@click`, `@submit.prevent`, `@keyup.enter`)
- `v-model` — two-way data binding for form inputs
- `v-bind` or `:` — bind attributes
- Event modifiers: `.prevent`, `.stop`, `.once`, `.self`
- Key modifiers: `@keyup.enter`, `@keyup.escape`

```html
<template>
  <!-- Conditional rendering -->
  <p v-if="score >= 90">Excellent</p>
  <p v-else-if="score >= 60">Good</p>
  <p v-else>Needs improvement</p>

  <!-- v-show (CSS display toggle) -->
  <p v-show="isVisible">I'm visible</p>

  <!-- Loop -->
  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>

  <!-- Events -->
  <button @click="handleClick">Click me</button>
  <form @submit.prevent="handleSubmit">
    <input v-model="username" placeholder="Username" />
    <button type="submit">Submit</button>
  </form>
</template>
```

**v-if vs v-show:**

- `v-if` removes/adds the element from the DOM — better for rarely toggled content
- `v-show` uses `display: none` — better for frequently toggled content

---

## 6. Components

- Components are reusable pieces of UI.
- Each component is a `.vue` file.
- **Props:** pass data from parent to child with `defineProps`.
- **Emits:** send events from child to parent with `defineEmits`.
- **Slots:** pass content/template from parent to child (like `children` in React).

```typescript
<!-- UserCard.vue -->
<script setup lang="ts">
interface Props {
  name: string;
  age: number;
  role?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  delete: [id: number];
}>();
</script>

<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Age: {{ age }}</p>
    <p v-if="role">Role: {{ role }}</p>
    <slot /> <!-- default slot -->
    <button @click="emit('delete', 1)">Delete</button>
  </div>
</template>
```

```html
<!-- Parent.vue -->
<template>
  <UserCard name="Anwar" :age="25" role="admin" @delete="handleDelete">
    <p>This goes into the slot</p>
  </UserCard>
</template>
```

---

## 7. Lifecycle Hooks

- `onMounted()` — after component is inserted into DOM (like `useEffect` with `[]` in React)
- `onUpdated()` — after reactive data changes and DOM updates
- `onUnmounted()` — before component is removed (cleanup, like `useEffect` cleanup in React)
- `onBeforeMount()` / `onBeforeUpdate()` / `onBeforeUnmount()`

```typescript
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

function handleResize() {
  console.log('Window resized');
}

onMounted(() => {
  console.log('Component mounted');
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  console.log('Component unmounted');
  window.removeEventListener('resize', handleResize);
});
</script>
```

---

## 8. Vue Router

- Official routing library for Vue.js.
- Define routes, navigate between pages.
- `<RouterLink>` for navigation (like `Link` in React Router).
- `<RouterView>` renders the matched component.
- `useRoute()` — access current route (params, query).
- `useRouter()` — navigate programmatically.
- Route params: `/user/:id`
- Navigation guards: `beforeEach` for auth checks.

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import UserProfile from '@/views/UserProfile.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/user/:id', component: UserProfile },
  ],
});

// Navigation guard
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.path !== '/login' && !isAuthenticated) {
    return '/login';
  }
});

export default router;
```

```html
<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView />
</template>
```

```typescript
// Inside a component
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
console.log(route.params.id); // access route params

const router = useRouter();
router.push('/about'); // navigate programmatically
```

---

## 9. Composables (Custom Hooks)

- Composables are Vue's version of React custom hooks.
- Functions that encapsulate and reuse stateful logic.
- Convention: name starts with `use` (e.g., `useCounter`, `useFetch`).

```typescript
// composables/useCounter.ts
import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  const reset = () => (count.value = initialValue);
  return { count, increment, decrement, reset };
}
```

```typescript
// composables/useFetch.ts
import { ref, watchEffect } from 'vue';

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref(true);

  watchEffect(async () => {
    loading.value = true;
    try {
      const res = await fetch(url);
      data.value = await res.json();
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  });

  return { data, error, loading };
}
```

```typescript
// Usage in a component
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter';
import { useFetch } from '@/composables/useFetch';

const { count, increment } = useCounter(10);
const { data: users, loading } = useFetch('/api/users');
</script>
```

---

## 10. What is Pinia?

- Pinia is the **official state management library** for Vue.js (replaced Vuex).
- Simple, type-safe, and lightweight.
- Works with Vue DevTools.

**Pinia vs Vuex:**

- Pinia has no mutations (simpler API)
- Pinia has full TypeScript support
- Pinia is modular by default (no nested modules)
- Pinia works with Composition API and Options API
- Vuex is legacy — Pinia is the recommended solution

**Pinia vs React state management:**

- Pinia store is similar to a Zustand store or React Context + `useReducer`
- Pinia getters are similar to computed values / selectors
- Pinia actions are similar to dispatch functions / action creators

**Installation:**

```bash
npm install pinia
```

---

## 11. Creating a Pinia Store

- Two styles: **Setup Store** (Composition API, recommended) and **Options Store**.
- `defineStore('storeName', () => { ... })` — setup style.
- `ref()` becomes state, `computed()` becomes getters, functions become actions.
- Use `storeToRefs()` to destructure reactive state.

**Setup Store (recommended):**

```typescript
// stores/counter.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  // State (ref)
  const count = ref(0);
  const name = ref('Counter');

  // Getters (computed)
  const doubleCount = computed(() => count.value * 2);
  const isPositive = computed(() => count.value > 0);

  // Actions (functions)
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = 0;
  }

  return { count, name, doubleCount, isPositive, increment, decrement, reset };
});
```

**Options Store (alternative):**

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

---

## 12. Using Pinia in Components

- Import the store and call it as a function.
- Use `storeToRefs()` for reactive destructuring (state + getters only).
- Actions can be destructured directly (they are not reactive).

```typescript
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore();

// storeToRefs keeps reactivity for state and getters
const { count, doubleCount } = storeToRefs(counterStore);

// Actions can be destructured directly
const { increment, decrement, reset } = counterStore;
</script>

<template>
  <h2>Count: {{ count }}</h2>
  <p>Double: {{ doubleCount }}</p>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="reset">Reset</button>
</template>
```

---

## 13. Pinia with Async Actions

- Actions can be async (API calls, etc.).
- Handle loading and error states inside the store.

```typescript
// stores/users.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('users', () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch('/api/users');
      users.value = await res.json();
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function addUser(userData: Omit<User, 'id'>) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const newUser = await res.json();
    users.value.push(newUser);
  }

  async function deleteUser(id: number) {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    users.value = users.value.filter((u) => u.id !== id);
  }

  return { users, loading, error, fetchUsers, addUser, deleteUser };
});
```

---

## 14. Pinia Plugins and Persistence

- Pinia supports plugins for extending functionality.
- `pinia-plugin-persistedstate` — persist store data to localStorage.

**Installation:**

```bash
npm install pinia-plugin-persistedstate
```

**Setup in main.ts:**

```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App).use(pinia).mount('#app');
```

**Persisted store example:**

```typescript
// stores/auth.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<string | null>(null);
    const user = ref<{ name: string; email: string } | null>(null);

    function login(newToken: string, userData: { name: string; email: string }) {
      token.value = newToken;
      user.value = userData;
    }

    function logout() {
      token.value = null;
      user.value = null;
    }

    const isAuthenticated = computed(() => !!token.value);

    return { token, user, isAuthenticated, login, logout };
  },
  {
    persist: true, // saves to localStorage automatically
  }
);
```

---

## 15. Vue vs React Quick Reference

- **Component files:** Vue uses `.vue` SFC (script + template + style), React uses `.tsx` (JSX)
- **State:** Vue uses `ref()` / `reactive()`, React uses `useState()`
- **Computed/Memo:** Vue uses `computed()`, React uses `useMemo()`
- **Side effects:** Vue uses `watch()` / `watchEffect()`, React uses `useEffect()`
- **Props:** Vue uses `defineProps<T>()`, React uses function parameters with types
- **Events:** Vue uses `defineEmits()` / `$emit`, React passes callback functions as props
- **Slots:** Vue uses `<slot />`, React uses `children` prop
- **Conditional rendering:** Vue uses `v-if` / `v-show`, React uses ternary / `&&`
- **Lists:** Vue uses `v-for`, React uses `.map()`
- **Two-way binding:** Vue has `v-model` built-in, React needs `value` + `onChange`
- **Routing:** Vue Router, React Router
- **State management:** Pinia, Zustand / Redux
- **Custom hooks:** Vue composables (`useSomething`), React hooks (`useSomething`)
- **Lifecycle:** Vue `onMounted` / `onUnmounted`, React `useEffect`
