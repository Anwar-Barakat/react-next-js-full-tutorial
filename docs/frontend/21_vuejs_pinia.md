# Vue.js & Pinia Guide

A guide to Vue.js core concepts and Pinia state management.

---

## 1. What is Vue.js?

- Progressive JavaScript framework; works for small widgets or full SPAs.
- Two API styles: **Options API** (Vue 2) and **Composition API** (Vue 3, recommended).
- Key differences from React: HTML-based templates instead of JSX, built-in directives (`v-if`, `v-for`, `v-model`), and built-in two-way binding.

---

## 2. Vue Project Setup

```bash
npm create vue@latest
cd my-project && npm install && npm run dev
```

Every `.vue` file (Single File Component) has three sections:

```html
<script setup lang="ts">
import { ref } from 'vue';
const message = ref('Hello Vue!');
</script>

<template>
  <h1>{{ message }}</h1>
</template>

<style scoped>
h1 { color: green; }
</style>
```

---

## 3. Template Syntax

```html
<template>
  <a :href="url">{{ linkText }}</a>
  <p :class="{ active: isActive }">Status</p>
  <p :style="{ color: textColor }">Styled text</p>
  <p>{{ count + 1 }}</p>
</template>
```

- Text interpolation: `{{ message }}`
- Attribute binding: `:href="url"` (shorthand for `v-bind:href`)
- Class binding: `:class="{ active: isActive }"`

---

## 4. Reactivity (ref, reactive, computed, watch)

- `ref()` — primitives; access via `.value` in script, direct in template.
- `reactive()` — objects/arrays; no `.value` needed.
- `computed()` — derived values, auto-updating (like `useMemo`).
- `watch()` — side effects on specific data changes (like `useEffect`).
- `watchEffect()` — auto-tracks dependencies and re-runs.

```typescript
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

const count = ref(0);
const user = reactive({ name: 'Anwar', age: 25 });
const doubleCount = computed(() => count.value * 2);

watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`);
});
</script>

<template>
  <p>Count: {{ count }} | Double: {{ doubleCount }}</p>
  <button @click="count++">Increment</button>
</template>
```

---

## 5. Directives

- `v-if` / `v-else-if` / `v-else` — removes element from DOM.
- `v-show` — toggles `display: none`; better for frequent toggles.
- `v-for` — loop over arrays; always provide `:key`.
- `@click` / `@submit.prevent` — event handling (shorthand for `v-on`).
- `v-model` — two-way binding for form inputs.

```html
<template>
  <p v-if="score >= 90">Excellent</p>
  <p v-else-if="score >= 60">Good</p>
  <p v-else>Needs improvement</p>

  <ul>
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>

  <form @submit.prevent="handleSubmit">
    <input v-model="username" placeholder="Username" />
    <button type="submit">Submit</button>
  </form>
</template>
```

---

## 6. Components, Props, Emits & Slots

```typescript
<!-- UserCard.vue -->
<script setup lang="ts">
const props = defineProps<{ name: string; age: number; role?: string }>();
const emit = defineEmits<{ delete: [id: number] }>();
</script>

<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Age: {{ age }}</p>
    <slot />
    <button @click="emit('delete', 1)">Delete</button>
  </div>
</template>
```

```html
<!-- Parent.vue -->
<UserCard name="Anwar" :age="25" @delete="handleDelete">
  <p>This goes into the slot</p>
</UserCard>
```

---

## 7. Lifecycle Hooks

```typescript
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

function handleResize() { console.log('resized'); }

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>
```

- `onMounted()` — after DOM insertion (like `useEffect(fn, [])`)
- `onUnmounted()` — cleanup before removal
- `onUpdated()` — after reactive data causes a DOM update

---

## 8. Vue Router

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/user/:id', component: () => import('@/views/UserProfile.vue') },
  ],
});

router.beforeEach((to) => {
  if (to.path !== '/login' && !localStorage.getItem('token')) return '/login';
});
```

```typescript
// Inside a component
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(route.params.id);
router.push('/about');
```

---

## 9. Composables (Custom Hooks)

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

---

## 10. Pinia (State Management)

Pinia is the official Vue state management library (replaced Vuex). No mutations, full TypeScript support. Comparable to Zustand for React.

```bash
npm install pinia
```

**Setup Store (recommended):** `ref` → state, `computed` → getters, functions → actions.

```typescript
// stores/counter.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() { count.value++; }
  function reset() { count.value = 0; }

  return { count, doubleCount, increment, reset };
});
```

```typescript
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store); // keeps reactivity
const { increment, reset } = store;                // actions: no storeToRefs needed
</script>

<template>
  <p>Count: {{ count }} | Double: {{ doubleCount }}</p>
  <button @click="increment">+</button>
  <button @click="reset">Reset</button>
</template>
```

---

## 11. Pinia Async Actions & Persistence

```typescript
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

  return { users, loading, error, fetchUsers };
});
```

**Persist state to localStorage:**

```bash
npm install pinia-plugin-persistedstate
```

```typescript
// main.ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
createApp(App).use(pinia).mount('#app');

// In a store, add persist as the third argument:
export const useAuthStore = defineStore('auth', () => { /* ... */ }, { persist: true });
```

---

## 12. Vue vs React Quick Reference

| Concept | Vue | React |
|---|---|---|
| State | `ref()` / `reactive()` | `useState()` |
| Derived values | `computed()` | `useMemo()` |
| Side effects | `watch()` / `watchEffect()` | `useEffect()` |
| Props | `defineProps<T>()` | function params with types |
| Events | `defineEmits()` / `$emit` | callback props |
| Children/Slots | `<slot />` | `children` prop |
| Conditional | `v-if` / `v-show` | ternary / `&&` |
| Lists | `v-for` | `.map()` |
| Two-way binding | `v-model` | `value` + `onChange` |
| Routing | Vue Router | React Router |
| Global state | Pinia | Zustand / Redux |
| Custom hooks | Composables | React hooks |
| Lifecycle | `onMounted` / `onUnmounted` | `useEffect` |
