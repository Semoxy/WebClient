import React, {useContext, useEffect, useState} from "react";
import {getServers, Server} from "../services/server";
import {useLoading} from "./loading/loading";
import {useHistory} from "react-router";
import {useSocketMessage} from "./socket";
import {ServerAddPacket, ServerEventPacket, ServerStateChangePacket} from "../services/socket";
import {PlayerJoinEvent, PlayerLeaveEvent} from "../services/event";

// fixme: state update on unmounted component when F5 in /server/new

interface ServerContextProps {
    servers: Server[],
    currentServer: Server | null,
    setCurrentServer(id: string): void
}

const ServerContext = React.createContext<ServerContextProps>({
    servers: [],
    currentServer: null,
    setCurrentServer() {}
})

export const ServerProvider: React.FC = ({children}) => {
    const [servers, setServers] = useState<Server[]>([])
    const [currentId, setCurrentId] = useState<string>()

    const [fetched, setFetched] = useState(false)

    const loading = useLoading()
    const history = useHistory()

    const currentServer = servers.find(s => s.id === currentId) || null

    useEffect(() =>  {
        loading.requestIntent("Loading Servers", "LOAD_SERVERS")
        getServers().then(s => {
            setServers(s)

            if (s.length === 0) {
                // let the user create a new server when none is existing
                history.replace("/server/new")
            } else {
                setCurrentId(s[0].id)
            }

            loading.finishIntent("LOAD_SERVERS")
            setFetched(true)
        })
    }, [])

    useEffect(() => {
        if (!fetched) return;

        if (!currentServer && currentId !== undefined) {
            // redirect to dashboard when id is wrong or not present
            history.replace("/dashboard")
        }

        if (!history.location.pathname.startsWith(`/server/${currentId}`)) {
            // history.push(`/server/${currentId}`)
        }
    }, [currentId, fetched])

    function mutateServer(id: string, data: (s: Server) => Partial<Server>) {
        setServers(servers.map(s => s.id === id ? Object.assign(s, data(s)) : s))
    }

    useSocketMessage((p: ServerStateChangePacket) => {
        mutateServer(p.data.id, () => p.data.patch)
    }, "SERVER_STATE_CHANGE")

    useSocketMessage((p: ServerEventPacket<PlayerJoinEvent>) => {
        mutateServer(p.data.serverId, (s) => {
            const newPlayers = s.onlinePlayers.slice()
            newPlayers.push(p.data.eventData.name)
            return {
                onlinePlayers: newPlayers
            }
        })
    }, "PLAYER_JOIN")

    useSocketMessage((p: ServerEventPacket<PlayerLeaveEvent>) => {
        mutateServer(p.data.serverId, (s) => {
            const newPlayers = s.onlinePlayers.slice().filter(pl => pl !== p.data.eventData.name)
            return {
                onlinePlayers: newPlayers
            }
        })
    }, "PLAYER_LEAVE")

    useSocketMessage((p: ServerAddPacket) => {
        const newServers = servers.slice()
        newServers.push(p.data)
        setServers(newServers)
    }, "SERVER_ADD")

    return <ServerContext.Provider value={{
        servers,
        currentServer,
        setCurrentServer: setCurrentId
    }}>
        { fetched && children }
    </ServerContext.Provider>
}

export function useServers() {
    return useContext(ServerContext)
}

export default ServerContext
