import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import AppRouter from "./UI/AppRouter";

// import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <nav>
            <Link to="/">Home</Link>
            <br />
            <Link to="/list">ListPage</Link>
            <br />
            <Link to="/ItemPage">ItemPage</Link>
            <br />
            <Link to="/StatsPage">StatsPage</Link>
          </nav>
        </div>

        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
