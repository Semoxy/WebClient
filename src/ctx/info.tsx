import React, {useContext, useEffect, useState} from "react";
import {Info, getInfo} from "../services/info";
import {useLoading} from "./loading/loading";

interface IInfoContextProps extends Info {
    setRAMCPUUsage(ramUsage: number, cpuUsage: number): void
}

const InfoContext = React.createContext<IInfoContextProps>({
    javaVersions: {},
    maxRam: 0,
    publicIP: "127.0.0.1",
    startTime: 0,
    systemRAM: 0,
    ramUsage: 0,
    cpuUsage: 0,
    setRAMCPUUsage() { }
})

export const InfoProvider: React.FC = ({children}) => {
    const [info, setInfo] = useState<Info>({
        javaVersions: {},
        maxRam: 0,
        publicIP: "127.0.0.1",
        startTime: new Date().getTime(),
        systemRAM: 0,
        ramUsage: 0,
        cpuUsage: 0
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

    function setRAMCPUUsage(ramUsage: number, cpuUsage: number) {
        const newInfo = Object.assign({}, info)
        newInfo.ramUsage = ramUsage
        newInfo.cpuUsage = cpuUsage
        setInfo(newInfo)
    }

    return <InfoContext.Provider value={{setRAMCPUUsage, ...info}}>
        { infoFetched && children }
    </InfoContext.Provider>
}

export function useInfo() {
    return useContext(InfoContext)
}

export default InfoContext
