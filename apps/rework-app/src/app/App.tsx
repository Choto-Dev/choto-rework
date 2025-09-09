import { Link } from "@swan-io/chicane";
import { Router } from "../routes";
import "./App.css";
import { match } from "ts-pattern";
import HomePage from "./pages/HomePage";

const App = () => {
  const route = Router.useRoute(["home"]);

  return (
    <>
      {match(route)
        .with({ name: "home" }, () => <HomePage />)
        .otherwise(() => (
          <div>
            <p>Not Found</p>

            <Link to={Router.home()}>New Page</Link>
          </div>
        ))}
    </>
  );
};

export default App;
