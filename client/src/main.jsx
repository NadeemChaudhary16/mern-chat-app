import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./ContextApi/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <ChatProvider>
        <App />
        <Toaster />
      </ChatProvider>
    </BrowserRouter>
  
);
