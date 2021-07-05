import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ErrorProvider } from "./ctx/error";
import {BrowserRouter, Route} from "react-router-dom";
import {LoginView} from "./login";
import {AuthProvider, useAuth} from "./ctx/auth";
import {deleteSession} from "./services/session";


function LogoutButton() {
    const auth = useAuth()

    function logout() {
        deleteSession().then(i => i && auth.setSessionId(null))
    }

    return <button onClick={logout}>Logout</button>
}


ReactDOM.render(
    <React.StrictMode>
        <ErrorProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Route path={"/login"}>
                        <LoginView />
                    </Route>
                    <Route path={"/"} exact>
                        Logged IN!!!!
                        <LogoutButton />
                    </Route>
                </AuthProvider>
            </BrowserRouter>
        </ErrorProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
