{/* 01-greet-component */ }
import { Greet } from "./components/01-greet-component";

{/* 02-multiple-components */ }
import { Header, MainContent, Footer } from "./components/02-multiple-components";

{/* 03-jsx-rules */ }
import { JSXRules } from "./components/03-jsx-rules";

{/* 04-dynamic-content */ }
import { Greeting, ProductInfo } from "./components/04-dynamic-content";

{/* 05-rendering-lists */ }
import { UserList, ProductList } from "./components/05-rendering-lists";

{/* 06-using-props */ }
import { Person, Product } from "./components/06-using-props";

{/* 07-conditional-rendering */ }
import { Weather, UserStatus, GreetingConditional } from "./components/07-conditional-rendering";

{/* 08-styling-components */ }
import { StyledCard, ProfileCard, IconComponent } from "./components/08-styling-components";

{/* 09-mastering-useState */ }
import { Counter, TodoList as TodoList09, Profile, ShoppingList } from "./components/09-mastering-useState";

{/* 10-understanding-useEffect */ }
import { BasicEffect, CounterEffect, FetchDataEffect } from "./components/10-understanding-useEffect";

{/* 11-context-useContext */ }
import { UserProvider, UserProfile, UpdateUser } from "./components/11-context-useContext";

{/* 12-using-useRef */ }
import { FocusInput, Timer } from "./components/12-using-useRef";

{/* 13-custom-hook-fetch */ }
import { FetchDataComponent } from "./components/13-custom-hook-fetch";

{/* 14-todo-list-crud */ }
import { TodoList } from "./components/14-todo-list-crud";

{/* 15-fetching-meals-axios */ }
import { MealList } from "./components/15-fetching-meals-axios";

{/* 16-calculator */ }
import { Calculator } from "./components/16-calculator";

{/* 17-toggle-bg-color */ }
import { ToggleBgColor } from "./components/17-toggle-bg-color";

{/* 18-testimonials-gallery */ }
import { Testimonials, Gallery } from "./components/18-testimonials-gallery";

{/* 19-validation-form */ }
import { ValidationForm } from "./components/19-validation-form";

{/* 20-button-with-types */ }
import { UsageExample } from "./components/20-button-with-types";

export default function Home() {
  return (
    <div>
      {/* 01-greet-component */}
      {/* <Greet /> */}

      {/* 02-multiple-components */}
      {/* <Header />
      <MainContent />
      <Footer /> */}

      {/* 03-jsx-rules */}
      {/* <JSXRules /> */}

      {/* 04-dynamic-content */}
      {/* <Greeting />
      <ProductInfo /> */}

      {/* 05-rendering-lists */}
      {/* <UserList />
      <ProductList /> */}

      {/* 06-using-props */}
      {/* <Person name="Alice" age={30} />
      <Product name="Laptop" price="200" /> */}

      {/* 07-conditional-rendering */}
      {/* <Weather temperature={20} />
      <UserStatus loggedIn={true} isAdmin={true} />
      <GreetingConditional timeOfDay="morning" /> */}

      {/* 08-styling-components */}
      {/* <StyledCard />
      <ProfileCard />
      <IconComponent /> */}

      {/* 09-mastering-useState */}
      {/* <Counter />
      <TodoList09 />
      <Profile />
      <ShoppingList /> */}

      {/* 10-understanding-useEffect */}
      {/* <BasicEffect />
      <CounterEffect />
      <FetchDataEffect /> */}

      {/* 11-context-useContext */}
      {/* <UserProvider>
        <UserProfile />
        <UpdateUser />
      </UserProvider> */}

      {/* 12-using-useRef */}
      {/* <FocusInput />
      <Timer /> */}

      {/* 13-custom-hook-fetch */}
      {/* <FetchDataComponent /> */}

      {/* 14-todo-list-crud */}
      {/* <TodoList /> */}

      {/* 15-fetching-meals-axios */}
      {/* <MealList /> */}

      {/* 16-calculator */}
      {/* <Calculator /> */}

      {/* 17-toggle-bg-color */}
      {/* <ToggleBgColor /> */}

      {/* 18-testimonials-gallery */}
      {/* <Testimonials /> */}
      {/* <Gallery /> */}

      {/* 19-validation-form */}
      {/* <ValidationForm /> */}

      {/* 20-button-with-types */}
      <UsageExample />
    </div>
  );
}

