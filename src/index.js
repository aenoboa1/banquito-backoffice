import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";

// Soft UI Dashboard React Context Provider
import {SoftUIControllerProvider} from "context";
import {ContextProvider} from "./context/custom/useStateContext";
import {RefreshProvider} from "./context/custom/useRefreshContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <SoftUIControllerProvider>
            <ContextProvider>
                <RefreshProvider>
                <App/>
                </RefreshProvider>
            </ContextProvider>
        </SoftUIControllerProvider>
    </BrowserRouter>
);