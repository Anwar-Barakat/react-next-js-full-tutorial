{/* 01-greet-component */ }
import Greet from "./components/01-greet-component/Greet";

{/* 02-multiple-components */ }
import { Header, MainContent, Footer } from "./components/02-multiple-components";

{/* 03-jsx-rules */ }
import { JSXRules } from "./components/03-jsx-rules";

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
      <JSXRules />
    </div>
  );
}
