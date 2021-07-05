import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ErrorProvider } from "./ctx/error";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {LoginView} from "./login";
import {AuthProvider, useAuth} from "./ctx/auth";
import {deleteSession} from "./services/session";
import {Title} from "./title";
import {UserProvider, useUser} from "./ctx/user";
import {ConfigProvider, useConfig} from "./ctx/config";


function LogoutButton() {
    const auth = useAuth()
    const user = useUser()
    const config = useConfig()

    function logout() {
        deleteSession().then(i => i && auth.setSessionId(null))
    }

    return <>
        Hello, {user.username}<br />
        The maximum RAM you can use per server is {config.config.maxRam}GB<br />
        <button onClick={logout}>Logout</button>
    </>
}


ReactDOM.render(
    <React.StrictMode>
        <ErrorProvider>
            <BrowserRouter>
                <AuthProvider>
                    <Switch>
                        <Route path={"/login"}>
                            <Title title={"Login"} />
                            <LoginView />
                        </Route>
                        <Route path={"/"}>
                            <UserProvider>
                                <ConfigProvider>
                                    <Title title={"Interface"} />
                                    <LogoutButton />
                                </ConfigProvider>
                            </UserProvider>
                        </Route>
                    </Switch>
                </AuthProvider>
            </BrowserRouter>
        </ErrorProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
