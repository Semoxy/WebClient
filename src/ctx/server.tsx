import React, {useContext, useEffect, useState} from "react";
import {getServers, Server} from "../services/server";
import {useLoading} from "./loading";

interface ServerContextProps {
    servers: Server[],
    currentServer: Server | null
}

const ServerContext = React.createContext<ServerContextProps>({
    servers: [],
    currentServer: null
})

export const ServerProvider: React.FC = ({children}) => {
    const [servers, setServers] = useState<Server[]>([])
    const [currentId, setCurrentId] = useState<string | null>("")
    const [fetched, setFetched] = useState(false)

    const loading = useLoading()

    useEffect(() =>  {
        loading.requestIntent("Loading Servers", "LOAD_SERVERS")
        getServers().then(s => {
            setServers(s)
            loading.finishIntent("LOAD_SERVERS")
            setFetched(true)
        })
    }, [])

    return <ServerContext.Provider value={{
        servers,
        currentServer: servers.find(s => s.id === currentId) || null
    }}>
        { fetched && children }
    </ServerContext.Provider>
}

export function useServers() {
    return useContext(ServerContext)
}

export default ServerContext
