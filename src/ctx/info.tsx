import React, {useContext, useEffect, useState} from "react";
import {Info, getInfo, SemoxyStatus, getStatus} from "../services/info";
import {useLoading} from "./loading/loading";

const InfoContext = React.createContext<Info>({
    javaVersions: {},
    maxRam: 0,
    publicIP: "127.0.0.1",
    startTime: 0
})

export const InfoProvider: React.FC = ({children}) => {
    const [info, setInfo] = useState<Info>({
        javaVersions: {},
        maxRam: 0,
        publicIP: "127.0.0.1",
        startTime: new Date().getTime()
    });
    const [infoFetched, setInfoFetched] = useState(false)

    const loading = useLoading()

    useEffect(() => {
        loading.requestIntent("Loading Instance Information", "LOAD_INFO")
        getInfo().then(c => {
            setInfo(c)
            loading.finishIntent("LOAD_INFO")
            setInfoFetched(true)
        })
    }, [])

    return <InfoContext.Provider value={info}>
        { infoFetched && children }
    </InfoContext.Provider>
}

export function useInfo() {
    return useContext(InfoContext)
}

export default InfoContext
