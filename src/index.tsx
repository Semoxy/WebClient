import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./colors.css"

import { ErrorProvider } from "./ctx/error";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./ctx/auth";
import { LoadingProvider } from "./ctx/loading/loading";
import { AlertProvider } from "./ctx/alert/alertctx";
import { App } from "./app";


/*
Global Contexts
 */
const AppContexts: React.FC = ({children}) => {
    return <React.StrictMode>
        <AlertProvider>
            <ErrorProvider>
                <LoadingProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </BrowserRouter>
                </LoadingProvider>
            </ErrorProvider>
        </AlertProvider>
    </React.StrictMode>
}


ReactDOM.render(
    <AppContexts>
        <App />
    </AppContexts>,
    document.getElementById('root')
);
