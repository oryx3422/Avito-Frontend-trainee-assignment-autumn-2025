import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./UI/AppRouter";
import Navbar from "./UI/Navbar";

// import "./styles/Reset.css";
// import './styles/App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
