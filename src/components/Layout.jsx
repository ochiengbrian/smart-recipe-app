import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="appShell">
      <a href="#mainContent" className="skipLink">
        Skip to content
      </a>

      <Navbar />
      <main id="mainContent" className="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
