import { Link } from "@swan-io/chicane";
import { Router } from "../routes";
import "./App.css";
import { match } from "ts-pattern";

const App = () => {
  const route = Router.useRoute(["home"]);

  return (
    <div className="content">
      {match(route)
        .with({ name: "home" }, () => <Home />)
        .otherwise(() => (
          <div>
            <p>Not Found</p>

            <Link to={Router.home()}>New Page</Link>
          </div>
        ))}
    </div>
  );
};

export default App;

function Home() {
  return (
    <div>
      <h1>Hello, ReWork App</h1>

      <button
        onClick={() => {
          fetch("http://localhost:3000/api");
        }}
        type="button"
      >
        Click To Check API
      </button>
    </div>
  );
}
