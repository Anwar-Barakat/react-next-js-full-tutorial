{/* 01-greet-component */ }
import Greet from "./components/01-greet-component/Greet";

import { Header, MainContent, Footer } from "./components/02-multiple-components";

export default function Home() {
  return (
    <div>
      {/* 01-greet-component */}
      {/* <Greet /> */}

      {/* 02-multiple-components */}
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}
