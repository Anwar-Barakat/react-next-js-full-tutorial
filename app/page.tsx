{/* 01-greet-component */ }
import Greet from "./components/01-greet-component/Greet";

{/* 02-multiple-components */ }
import { Header, MainContent, Footer } from "./components/02-multiple-components";

{/* 03-jsx-rules */ }
import { JSXRules } from "./components/03-jsx-rules";

{/* 04-dynamic-content */ }
import { Greeting, ProductInfo } from "./components/04-dynamic-content";

{/* 05-rendering-lists */ }
import { UserList, ProductList } from "./components/05-rendering-lists";

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
      <UserList />
      <ProductList />
    </div>
  );
}
