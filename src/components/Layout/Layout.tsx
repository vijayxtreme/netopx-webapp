import "../../App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Link } from "react-router-dom";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="App">
      <h1>Network Optix - Placeholder JSON App</h1>
      <ul className="nav">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/download">Download</Link>
        </li>
      </ul>

      {children}
    </div>
  );
}

export default Layout;
