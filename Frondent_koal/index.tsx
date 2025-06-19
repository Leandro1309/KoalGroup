import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Las siguientes importaciones han sido comentadas o corregidas porque los módulos no se encuentran o las rutas son incorrectas.
// import { Navbar } from '../comunes/Navbar';
// import { Dashboard } from '../supervisor/Dashboard';
// import { AccessControlPanel } from '/../../modules/AccessControl/AccessControlPanel';

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}