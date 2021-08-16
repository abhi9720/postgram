import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { QueryClient, QueryClientProvider } from "react-query";
const options = {
  // you can also just use 'bottom center'
  timeout: 4000,
  offset: "30px",
  color: "white",
  width: "400px",
  zindex: 100,

  // you can also just use 'scale'
  transition: transitions.SCALE,
};
const queryClient = new QueryClient();
ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthContextProvider>
  </AlertProvider>,
  document.getElementById("root")
);
