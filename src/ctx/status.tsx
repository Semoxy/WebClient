import React, {useContext, useEffect, useState} from "react"
import {getStatus, SemoxyStatus} from "../services/info"
import {useLoading} from "./loading/loading"
import {useHistory} from "react-router"
import {useError} from "./error";


interface IStatusContextProps {
    status: SemoxyStatus,
    reload(): void
}


const StatusContext = React.createContext<IStatusContextProps>({
    status: {
        software: "Semoxy",
        repository: "https://github.com/SemoxyMC/Server",
        version: "",
        description: "Semoxy is a universal decentralized Minecraft Server Interface for the Web",
        issueTracker: "https://github.com/SemoxyMC/Server/issues",
        hasRoot: true
    },
    reload() {
    }
})

export const StatusProvider: React.FC = ({children}) => {
    const [fetched, setFetched] = useState(false)
    const [status, setStatus] = useState<SemoxyStatus>({
        software: "Semoxy",
        repository: "https://github.com/SemoxyMC/Server",
        version: "",
        description: "Semoxy is a universal decentralized Minecraft Server Interface for the Web",
        issueTracker: "https://github.com/SemoxyMC/Server/issues",
        hasRoot: true
    })

    const loading = useLoading()
    const history = useHistory()
    const err = useError()

    useEffect(() => {
        if (!status.hasRoot) {
            history.replace("/create-root-user")
        }
    }, [status])

    function reload() {
        setFetched(false)
        loading.requestIntent("Loading Semoxy Status", "LOAD_STATUS")
        getStatus(err).then(s => {
            setStatus(s)
            loading.finishIntent("LOAD_STATUS")
            setFetched(true)
        })
    }

    useEffect(() => {
        reload()
    }, [])

    return <StatusContext.Provider value={{status, reload}}>
        { fetched && children}
    </StatusContext.Provider>
}

export function useSemoxyStatus() {
    return useContext(StatusContext)
}

export default StatusContext
