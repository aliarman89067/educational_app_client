import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import App from "./pages/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext.tsx";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SocketProvider>
      <App />
    </SocketProvider>
  </BrowserRouter>
);
