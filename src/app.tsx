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
                            <InterfaceGrid>
                                <Switch>
                                    <Route path={"/dashboard"}>
                                        <Title>Dashboard</Title>
                                        Dashboard
                                    </Route>
                                    <Route path={"/server"}>
                                        <Switch>
                                            <Route path={"/server/new"}>
                                                <Title>New Server</Title>
                                                New Server
                                            </Route>

                                            <Route path={"/server/:serverId"}>
                                                <Switch>
                                                    <Route path={"/server/:serverId/players"}>
                                                        <Title>Players</Title>
                                                        Players
                                                    </Route>
                                                    <Route path={"/server/:serverId/console"}>
                                                        <Title>Console</Title>
                                                        Console
                                                    </Route>
                                                    <Route path={"/server/:serverId/backups"}>
                                                        <Title>Backups</Title>
                                                        Backups
                                                    </Route>
                                                    <Route path={"/server/:serverId/settings"}>
                                                        <Title>Settings</Title>
                                                        Settings
                                                    </Route>
                                                    <Route path={"/server/:serverId/addons"}>
                                                        <Title>Addons</Title>
                                                        Addons
                                                    </Route>
                                                    <Route path={"/server/:serverId/worlds"}>
                                                        <Title>Worlds</Title>
                                                        Worlds
                                                    </Route>
                                                    <Route path={"/server/:serverId/dsm"}>
                                                        <Title>DSM</Title>
                                                        Dynamic Server Management
                                                    </Route>
                                                    <Route path={"/server/:serverId"}>
                                                        <Title>Overview</Title>
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

                                    <Route path={"/users"}>
                                        <Title>User Settings</Title>
                                        User Settings
                                    </Route>

                                    <Route path={"/settings"}>
                                        <Title>Semoxy Settings</Title>
                                        Semoxy Settings
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
