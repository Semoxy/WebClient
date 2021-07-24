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
import {InfoProvider, useInfo} from "./ctx/info";
import {LoadingProvider} from "./ctx/loading";
import {SocketProvider, useSocket, useSocketMessage} from "./ctx/socket";
import {MetaMessagePacket} from "./services/socket";


function LogoutButton() {
    const auth = useAuth()
    const user = useUser()
    const config = useInfo()
    const socket = useSocket()

    function logout() {
        deleteSession().then(i => i && auth.setSessionId(null))
    }

    useSocketMessage((msg: MetaMessagePacket) => {
        console.log("Socket Logged In")
    }, "AUTH_SUCCESS", "LogoutButton")

    useSocketMessage((msg) => {
        console.log("Error while Logging in")
    }, "AUTH_ERROR", "LogoutButton")

    return <>
        Hello, {user.username}<br />
        The maximum RAM you can use per server is {config.info.maxRam}GB<br />
        The websocket is {socket.authenticated ? "open" : "closed"}<br />
        <button onClick={logout}>Logout</button>
    </>
}


ReactDOM.render(
    <React.StrictMode>
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
                                            <Title title={"Interface"} />
                                            <LogoutButton />
                                        </InfoProvider>
                                    </SocketProvider>
                                </UserProvider>
                            </Route>
                        </Switch>
                    </AuthProvider>
                </BrowserRouter>
            </LoadingProvider>
        </ErrorProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
