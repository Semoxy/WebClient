import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./colors.css"

import { ErrorProvider } from "./ctx/error";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { LoginView } from "./pages/login/login";
import { AuthProvider, useAuth } from "./ctx/auth";
import { deleteSession } from "./services/session";
import { Title } from "./title";
import { UserProvider, useUser } from "./ctx/user";
import { InfoProvider, useInfo } from "./ctx/info";
import { LoadingProvider } from "./ctx/loading";
import { SocketProvider, useSocket } from "./ctx/socket";
import { ServerProvider, useServers } from "./ctx/server";
import Button from "./components/button";
import {AlertProvider} from "./alert/alertctx";


function LogoutButton() {
    const auth = useAuth()
    const user = useUser()
    const config = useInfo()
    const socket = useSocket()
    const server = useServers()

    function logout() {
        deleteSession().then(i => i && auth.setSessionId(null))
    }

    return <>
        Hello, {user.username}<br />
        The maximum RAM you can use per server is {config.info.maxRam}GB<br />
        The websocket is {socket.authenticated ? "open" : "closed"}<br />
        There are {server.servers.length} Servers<br />
        <Button onClick={logout} type={"secondary"} border>Logout</Button>
    </>
}


ReactDOM.render(
    <React.StrictMode>
        <AlertProvider>
            <ErrorProvider>
                <LoadingProvider>
                    <BrowserRouter>
                        <AuthProvider>
                            <Switch>
                                <Route path={"/login"}>
                                    <Title title={"Login"} />
                                    <LoginView />
                                </Route>
                                <Route path={"/"}>
                                    <UserProvider>
                                        <SocketProvider>
                                            <InfoProvider>
                                                <ServerProvider>
                                                    <Title title={"Interface"} />
                                                    <LogoutButton />
                                                </ServerProvider>
                                            </InfoProvider>
                                        </SocketProvider>
                                    </UserProvider>
                                </Route>
                            </Switch>
                        </AuthProvider>
                    </BrowserRouter>
                </LoadingProvider>
            </ErrorProvider>
        </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
