import React from "react";
import ReactDOM from "react-dom/client"; // Note the change here
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";

// Create the root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Use root.render instead of ReactDOM.render
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <App />
      <Footer />
    </BrowserRouter>
  </React.StrictMode>
);
