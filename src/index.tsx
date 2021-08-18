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
import {StatusProvider} from "./ctx/status";
import {DesignProvider} from "./ctx/design";


/*
Global Contexts
 */
const AppContexts: React.FC = ({children}) => {
    return <React.StrictMode>
        <DesignProvider>
            <AlertProvider>
                <ErrorProvider>
                    <LoadingProvider>
                        <BrowserRouter>
                            <StatusProvider>
                                <AuthProvider>
                                    {children}
                                </AuthProvider>
                            </StatusProvider>
                        </BrowserRouter>
                    </LoadingProvider>
                </ErrorProvider>
            </AlertProvider>
        </DesignProvider>
    </React.StrictMode>
}


ReactDOM.render(
    <AppContexts>
        <App />
    </AppContexts>,
    document.getElementById('root')
);
