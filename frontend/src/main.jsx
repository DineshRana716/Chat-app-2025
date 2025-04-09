import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// Initialize the theme
const theme = extendTheme({});
import ChatProvider from "./Context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);
