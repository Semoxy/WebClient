import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "./colors.css"

import { ErrorProvider } from "./ctx/error";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import { LoginView } from "./pages/login/login";
import { AuthProvider, useAuth } from "./ctx/auth";
import { deleteSession } from "./services/session";
import { Title } from "./title";
import { UserProvider, useUser } from "./ctx/user";
import { InfoProvider, useInfo } from "./ctx/info";
import { LoadingProvider } from "./ctx/loading/loading";
import { SocketProvider, useSocket } from "./ctx/socket";
import { ServerProvider, useServers } from "./ctx/server";
import Button from "./components/button";
import {AlertProvider} from "./ctx/alert/alertctx";
import {useParams} from "react-router";


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


function ServerView() {
    const server = useServers()

    return <>
        Server Name: {server.currentServer?.name}
    </>
}


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


function ServerIdSetter() {
    const url = useParams<{serverId: string}>()
    const servers = useServers()

    useEffect(() => {
        servers.setCurrentServer(url.serverId)
    }, [url])

    return <></>
}


function App() {
    const auth = useAuth()

    return <Switch>
        <Route path={"/login"}>
            <Title>Login</Title>
            <LoginView />
        </Route>
        { auth.isLoggedIn && <Route path={"/"}>
            <UserProvider>
                <SocketProvider>
                    <InfoProvider>
                        <ServerProvider>
                            <Title>Interface</Title>
                            <Switch>
                                <Route path={"/dashboard"}>
                                    Dashboard
                                </Route>

                                <Route path={"/server"}>
                                    <Switch>
                                        <Route path={"/server/:serverId"}>
                                            <Switch>
                                                <Route path={"/server/:serverId/players"}>
                                                    Players
                                                </Route>
                                                <Route path={"/server/:serverId"}>
                                                    <ServerView />
                                                </Route>
                                            </Switch>
                                            <ServerIdSetter />
                                        </Route>
                                        <Route path={"/"}>
                                            <Redirect to={"/dashboard"} />
                                        </Route>
                                    </Switch>
                                </Route>

                                <Route path={"/"}>
                                    <Redirect to={"/dashboard"} />
                                </Route>
                            </Switch>
                            {/*<LogoutButton />*/}
                        </ServerProvider>
                    </InfoProvider>
                </SocketProvider>
            </UserProvider>
        </Route> }
    </Switch>
}


ReactDOM.render(
    <AppContexts>
        <App />
    </AppContexts>,
    document.getElementById('root')
);
