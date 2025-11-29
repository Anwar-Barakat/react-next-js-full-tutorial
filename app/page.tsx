'use client';
import { useState } from 'react';
import { BookOpen } from 'lucide-react'; // Import the icon


{/* 01-greet-component */ }
import { Greet as Greetv01 } from "./components/01-greet-component";

{/* 02-multiple-components */ }
import { Header as Headerv02, MainContent as MainContentv02, Footer as Footerv02 } from "./components/02-multiple-components";

{/* 03-jsx-rules */ }
import { JSXRules as JSXRulesv03 } from "./components/03-jsx-rules";

{/* 04-dynamic-content */ }
import { Greeting as Greetingv04, ProductInfo as ProductInfov04 } from "./components/04-dynamic-content";

{/* 05-rendering-lists */ }
import { UserList as UserListv05, ProductList as ProductList05 } from "./components/05-rendering-lists";

{/* 06-using-props */ }
import { Person as Personv06, Product as Productv06 } from "./components/06-using-props";

{/* 07-conditional-rendering */ }
import { Weather as Weatherv07, UserStatus as UserStatusv07, GreetingConditional as GreetingConditionalv07 } from "./components/07-conditional-rendering";

{/* 08-styling-components */ }
import { StyledCard as StyledCardv08, ProfileCard as ProfileCardv08, IconComponent as IconComponentv08 } from "./components/08-styling-components";

{/* 09-mastering-useState */ }
import { Counter as Counter09, TodoList as TodoList09, Profile as Profilev09, ShoppingList as ShoppingListv09 } from "./components/09-mastering-useState";

{/* 10-understanding-useEffect */ }
import { BasicEffect as BasicEffectv10, CounterEffect as CounterEffectv10, FetchDataEffect as FetchDataEffectv10 } from "./components/10-understanding-useEffect";

{/* 11-context-useContext */ }
import { UserProvider as UserProviderv11, UserProfile as UserProfilev11, UpdateUser as UpdateUserv11 } from "./components/11-context-useContext";

{/* 12-using-useRef */ }
import { FocusInput as FocusInputv12, Timer as Timerv12 } from "./components/12-using-useRef";

{/* 13-custom-hook-fetch */ }
import { FetchDataComponent as FetchDataComponentv13 } from "./components/13-custom-hook-fetch";

{/* 14-todo-list-crud */ }
import { TodoList as TodoList14 } from "./components/14-todo-list-crud";

{/* 15-fetching-meals-axios */ }
import { MealList as MealListv15 } from "./components/15-fetching-meals-axios";

{/* 16-calculator */ }
import { Calculator as Calculatorv16 } from "./components/16-calculator";

{/* 17-toggle-bg-color */ }
import { ToggleBgColor as ToggleBgColorv17 } from "./components/17-toggle-bg-color";
{/* 18-testimonials-gallery */ }
import { App as Appv18 } from "./components/18-testimonials-gallery/App";

{/* 19-validation-form */ }
import { ValidationForm as ValidationFormv19 } from "./components/19-validation-form";

{/* 20-button-with-types */ }
import { UsageExample as ButtonUsageExamplev20 } from "./components/20-button-with-types";

{/* 21-typing-useState */ }
import { UsageExample as UseStateUsageExamplev21 } from "./components/21-typing-useState";

{/* 22-form-using-ref */ }
import { FormWithRef as FormWithRefv22 } from "./components/22-form-using-ref";

{/* 23-react-typescript-event-handler */ }
import { UsageExample as EventHandlerUsageExamplev23 } from "./components/23-react-typescript-event-handler";

{/* 24-react-context-api */ }
import { UsageExample as ContextUsageExamplev24 } from "./components/24-react-context-api";

{/* 25-reducer-using-typescript */ }
import { TodoList as TodoList25 } from "./components/25-reducer-using-typescript";

{/* 26-useReducer-counter */ }
import { Counter as Counter26 } from "./components/26-useReducer-counter";

{/* 27-user-registration-form */ }
import { UserRegistrationForm as UserRegistrationFormv27 } from "./components/27-user-registration-react-hook-form";

// 28-use-hook-instead-of-useContext
import { UseHookDemo as UseHookDemov28 } from "./components/28-use-hook-instead-of-useContext";

// 29-use-vs-useEffect-for-fetching
import { DataFetchingDemo as DataFetchingDemov29 } from "./components/29-use-vs-useEffect-for-fetching";

// 30-react-typescript-project-1
import { App as Project1Appv30 } from "./components/30-react-typescript-project-1";

// 31-blog-platform-project
import { App as Appv31 } from "./components/31-blog-platform-project";

// 32-client-table
import { Dashboard as Dashboardv32 } from "./components/32-client-table";

// 33-framer-motion-fundamentals
import { FramerMotionDemo as FramerMotionDemov33 } from "./components/33-framer-motion-fundamentals";

// 34-framer-motion-exercises
import { FramerMotionExercises as FramerMotionExercisesv34 } from "./components/34-framer-motion-exercises";

// 35-framer-motion-keyframes
import { FramerMotionKeyframes as FramerMotionKeyframesv35 } from "./components/35-framer-motion-keyframes";

// 36-framer-motion-variants
import { FramerMotionVariants as FramerMotionVariantsv36 } from "./components/36-framer-motion-variants";

// 37-framer-motion-stagger
import { FramerMotionStagger as FramerMotionStaggerv37 } from "./components/37-framer-motion-stagger";

// 38-framer-motion-usemotionvalue
import { FramerMotionUseMotionValue as FramerMotionUseMotionValuev38 } from "./components/38-framer-motion-usemotionvalue";

// 39-framer-motion-advanced
import { FramerMotionAdvanced as FramerMotionAdvancedv39 } from "./components/39-framer-motion-advanced";

// 40-scroll-animations-gallery
import { FullPageScrollGallery as FullPageScrollGalleryv40 } from "./components/40-scroll-animations-gallery";

// 41-zustand-recipe-app
import { RecipeApp as RecipeAppv41 } from "./components/41-zustand-recipe-app";

// 42-zustand-expense-tracker
import { ExpenseTracker as ExpenseTrackerv42 } from "./components/42-zustand-expense-tracker";

// 43-zustand-password-generator
import { PasswordGenerator as PasswordGeneratorv43 } from "./components/43-zustand-password-generator";

// 44-zustand-form-builder
import { FormBuilder as FormBuilderv44 } from "./components/44-zustand-form-builder";

// 45-zustand-notes-management
import { NotesApp as NotesAppv45 } from "./components/45-zustand-notes-management";

// 46-zustand-workspace-management
import { WorkspaceApp as WorkspaceAppv46 } from "./components/46-zustand-workspace-management";

// 47-zustand-quiz-app
import { QuizApp as QuizAppV47 } from "./components/47-zustand-quiz-app";

// 48-zustand-market
import ZustandMarketAppv48 from "./components/48-zustand-market";

// 49-redux-toolkit-fundamentals
import { ReduxToolkitDemo as ReduxToolkitDemov49 } from "./components/49-redux-toolkit-fundamentals";

// 50-redux-kanban-board
import { KanbanClientWrapper } from "./components/KanbanClientWrapper";

// 51-react-query-json-server
import { ReactQueryDemo as ReactQueryDemov51 } from "./components/51-react-query-json-server";
import { ReactQueryMutationsDemo as ReactQueryMutationsDemov52 } from "./components/52-react-query-mutations";

// 53-product-list
import { ProductList as ProductList53 } from "./components/53-product-list-with-stripe";

const components = {
  '01': { name: 'Greet Component', component: <Greetv01 /> },
  '02': { name: 'Multiple Components', component: <><Headerv02 /><MainContentv02 /><Footerv02 /></> },
  '03': { name: 'JSX Rules', component: <JSXRulesv03 /> },
  '04': { name: 'Dynamic Content', component: <><Greetingv04 name="John" /><ProductInfov04 product={{ name: "Laptop", price: 1200, availability: "In stock" }} /></> },
  '05': { name: 'Rendering Lists', component: <><UserListv05 users={[{ id: 1, name: 'John', email: 'john@example.com' }, { id: 2, name: 'Jane', email: 'jane@example.com' }]} /><ProductList05 products={[{ id: 1, name: 'Laptop', price: 1200 }, { id: 2, name: 'Mouse', price: 50 }, { id: 3, name: 'Keyboard', price: 100 }]} /></> },
  '06': { name: 'Using Props', component: <><Personv06 name="Alice" age={30} /><Productv06 name="Laptop" price={200} /></> },
  '07': { name: 'Conditional Rendering', component: <><Weatherv07 temperature={20} /><UserStatusv07 loggedIn={true} isAdmin={true} /><GreetingConditionalv07 timeOfDay="morning" /></> },
  '08': { name: 'Styling Components', component: <><StyledCardv08 /><ProfileCardv08 /><IconComponentv08 /></> },
  '09': { name: 'Mastering useState', component: <><Counter09 /><TodoList09 /><Profilev09 /><ShoppingListv09 /></> },
  '10': { name: 'Understanding useEffect', component: <><BasicEffectv10 /><CounterEffectv10 /><FetchDataEffectv10 /></> },
  '11': { name: 'Context & useContext', component: <UserProviderv11><UserProfilev11 /><UpdateUserv11 /></UserProviderv11> },
  '12': { name: 'Using useRef', component: <><FocusInputv12 /><Timerv12 /></> },
  '13': { name: 'Custom Hook Fetch', component: <FetchDataComponentv13 /> },
  '14': { name: 'Todo List CRUD', component: <TodoList14 /> },
  '15': { name: 'Fetching Meals Axios', component: <MealListv15 /> },
  '16': { name: 'Calculator', component: <Calculatorv16 /> },
  '17': { name: 'Toggle BG Color', component: <ToggleBgColorv17 /> },
  '18': { name: 'Testimonials Gallery', component: <Appv18 /> },
  '19': { name: 'Validation Form', component: <ValidationFormv19 /> },
  '20': { name: 'Button with Types', component: <ButtonUsageExamplev20 /> },
  '21': { name: 'Typing useState', component: <UseStateUsageExamplev21 /> },
  '22': { name: 'Form using Ref', component: <FormWithRefv22 /> },
  '23': { name: 'React TypeScript Event Handler', component: <EventHandlerUsageExamplev23 /> },
  '24': { name: 'React Context API', component: <ContextUsageExamplev24 /> },
  '25': { name: 'Reducer using TypeScript', component: <TodoList25 /> },
  '26': { name: 'useReducer Counter', component: <Counter26 /> },
  '27': { name: 'User Registration Form', component: <UserRegistrationFormv27 /> },
  '28': { name: 'use Hook instead of useContext', component: <UseHookDemov28 /> },
  '29': { name: 'use vs useEffect for fetching', component: <DataFetchingDemov29 /> },
  '30': { name: 'React TypeScript Project 1', component: <Project1Appv30 /> },
  '31': { name: 'Blog Platform Project', component: <Appv31 /> },
  '32': { name: 'Client Table', component: <Dashboardv32 /> },
  '33': { name: 'Framer Motion Fundamentals', component: <FramerMotionDemov33 /> },
  '34': { name: 'Framer Motion Exercises', component: <FramerMotionExercisesv34 /> },
  '35': { name: 'Framer Motion Keyframes', component: <FramerMotionKeyframesv35 /> },
  '36': { name: 'Framer Motion Variants', component: <FramerMotionVariantsv36 /> },
  '37': { name: 'Framer Motion Stagger', component: <FramerMotionStaggerv37 /> },
  '38': { name: 'Framer Motion useMotionValue', component: <FramerMotionUseMotionValuev38 /> },
  '39': { name: 'Framer Motion Advanced', component: <FramerMotionAdvancedv39 /> },
  '40': { name: 'Scroll Animations Gallery', component: <FullPageScrollGalleryv40 /> },
  '41': { name: 'Zustand Recipe App', component: <RecipeAppv41 /> },
  '42': { name: 'Zustand Expense Tracker', component: <ExpenseTrackerv42 /> },
  '43': { name: 'Zustand Password Generator', component: <PasswordGeneratorv43 /> },
  '44': { name: 'Zustand Form Builder', component: <FormBuilderv44 /> },
  '45': { name: 'Zustand Notes Management', component: <NotesAppv45 /> },
  '46': { name: 'Zustand Workspace Management', component: <WorkspaceAppv46 /> },
  '47': { name: 'Zustand Quiz App', component: <QuizAppV47 /> },
  '48': { name: 'Zustand Market', component: <ZustandMarketAppv48 /> },
  '49': { name: 'Redux Toolkit Fundamentals', component: <ReduxToolkitDemov49 /> },
  '50': { name: 'Redux Kanban Board', component: <KanbanClientWrapper /> },
  '51': { name: 'React Query JSON Server', component: <ReactQueryDemov51 /> },
  '52': { name: 'React Query Mutations', component: <ReactQueryMutationsDemov52 /> },
  '53': { name: 'Product List with Stripe', component: <ProductList53 /> },
};

export default function Home() {
  const [selectedKey, setSelectedKey] = useState(Object.keys(components)[0]);

  const selectedComponent = components[selectedKey];

  return (
    <div className="min-h-screen">
      <div className="glass max-h-[30rem] overflow-y-auto p-4 rounded-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <h1 className='text-4xl sm:col-span-2 lg:col-span-3 xl:col-span-4 font-bold mb-4 text-primary-hover'>Component Showcase</h1>
          {Object.keys(components)
            .sort((a, b) => parseInt(a) - parseInt(b)) // Explicitly sort keys numerically
            .map((key) => {
              const { name } = components[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`glass w-full h-28 p-4 transition-all duration-300 flex flex-col items-center justify-center text-center rounded-xl ${selectedKey === key
                    ? 'border-primary shadow-xl scale-105 bg-gradient-to-br from-primary/30 to-primary/50'
                    : 'border-glass-border hover:border-primary/50 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-5 h-5 mr-2 text-primary-hover/50" />
                    <span className="text-xl font-bold text-primary-hover">{key}</span>
                  </div>
                  <span className="text-base leading-tight">{name}</span>
                </button>
              )
            })}
        </div>
      </div>

      <hr className="my-8 border-glass-border opacity-30" />

      <div className="glass glass-xl mb-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-hover">
          {selectedKey}: {selectedComponent.name}
        </h2>
        <div className="center-content p-4">
          <div
            key={selectedKey}
            className="w-full" // Ensure it takes full width of its container
          >
            {selectedComponent.component}
          </div>
        </div>
      </div>
    </div>
  );
}