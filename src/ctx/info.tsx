import React, {useContext, useEffect, useState} from "react";
import {Info, getInfo} from "../services/info";
import {useLoading} from "./loading";

interface InfoContextProps {
    info: Info
}

const InfoContext = React.createContext<InfoContextProps>({
    info: {
        javaVersions: {},
        maxRam: 0,
        publicIP: "127.0.0.1"
    }
})

export const InfoProvider: React.FC = ({children}) => {
    const [info, setInfo] = useState<Info>({
        javaVersions: {},
        maxRam: 0,
        publicIP: "127.0.0.1"
    });
    const [fetched, setFetched] = useState(false)

    const loading = useLoading()

    useEffect(() => {
        loading.requestIntent("Loading Instance Information", "LOAD_INFO")
        getInfo().then(c => {
            setInfo(c)
            setFetched(true)
            loading.finishIntent("LOAD_INFO")
        })
    }, [])

    return <InfoContext.Provider value={{info: info}}>
        { fetched && children }
    </InfoContext.Provider>
}

export function useInfo() {
    return useContext(InfoContext)
}

export default InfoContext
