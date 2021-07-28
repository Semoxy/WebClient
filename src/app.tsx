import {useAuth} from "./ctx/auth";
import {Redirect, Route, Switch} from "react-router-dom";
import {Title} from "./title";
import {LoginView} from "./pages/login/login";
import {UserProvider} from "./ctx/user";
import {SocketProvider} from "./ctx/socket";
import {InfoProvider} from "./ctx/info";
import {ServerProvider, useServers} from "./ctx/server";
import React, {useEffect} from "react";
import {useParams} from "react-router";
import {InterfaceGrid} from "./components/interface/grid";


// logout: deleteSession().then(i => i && auth.setSessionId(null))


function ServerIdSetter() {
    const url = useParams<{serverId: string}>()
    const servers = useServers()

    useEffect(() => {
        servers.setCurrentServer(url.serverId)
    }, [url])

    return <></>
}


export const App: React.FC = () => {
    const auth = useAuth()

    return <Switch>
        <Route path={"/login"}>
            <Title>Login</Title>
            <LoginView />
        </Route>
        { auth.isLoggedIn &&
        <Route path={"/"}>
            <UserProvider>
                <SocketProvider>
                    <InfoProvider>
                        <ServerProvider>
                            <Title>Interface</Title>
                            <InterfaceGrid>
                                {/*Header, Navbar*/}
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
                                                        Server Overview
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
                            </InterfaceGrid>
                        </ServerProvider>
                    </InfoProvider>
                </SocketProvider>
            </UserProvider>
        </Route>
        }
    </Switch>
}
