import styles from "./serverCreation.module.css"
import React, {useEffect, useState} from "react"
import {Headline} from "../index"
import {SoftwareSelection} from "./software"
import {VersionSelection} from "./version"
import {DetailsSelection} from "./details"
import {RAMSelection} from "./ram"
import Button from "../../components/button"
import {APIRequest, getAPIUrl} from "../../services"
import { createServer as API_createServer } from "../../services/server"
import {useInfo} from "../../ctx/info"
import {useAlert} from "../../ctx/alert/alertctx"
import {useLoading} from "../../ctx/loading/loading"
import {useServers} from "../../ctx/server"
import {ButtonRow} from "../../components/interface/boxes/box"


export type Versions = {[x: string]: string[]}

export interface Software {
    id: string,
    versions: Versions,
    name: string,
    description: string,
    image: string,
    majorVersions?: string[],
    majorVersionName: string,
    minorVersionName: string
}


function useServerVersions(): [Software[], {
    selectedSoftware?: Software
    setCurrentSoftware(s: string): void
    currentMinor?: string
    setCurrentMinor(s: string): void
    currentMajor?: string
    setCurrentMajor(s: string): void
}, () => void] {
    const [softwares, setSoftwares] = useState<Software[]>([])
    const [currentSoftware, setCurrentSoftware] = useState<string>()
    const [currentMajor, setCurrentMajor] = useState<string>()
    const [currentMinor, setCurrentMinor] = useState<string>()

    const loading = useLoading()

    const selectedSoftware = softwares.find(e => e.id === currentSoftware)

    function reset() {
        loading.requestIntent("Fetching Versions", "FETCH_SOFTWARES")
        const r = new APIRequest("/versions")
        r.addCredentials()
        r.get().then(r => {
            setSoftwares(r.data.map((e: Partial<Software>) => {
                const versionsObj: Versions = {}

                if (e.majorVersions) {
                    for (let major of e.majorVersions) {
                        versionsObj[major] = []
                    }
                }

                delete e.majorVersions

                return Object.assign(e, {
                    image: e.image?.replace("$BASE/", getAPIUrl("")),
                    versions: versionsObj
                })
            }))
            setCurrentSoftware(r.data[0].id)
            loading.finishIntent("FETCH_SOFTWARES")
        })
    }

    useEffect(() => {
        reset()
    }, [])

    useEffect(() => {
        const selected = softwares.find(e => e.id === currentSoftware)
        if (!selected) return

        const keys = Object.keys(selected.versions)
        // select latest major version
        setCurrentMajor(keys[keys.length - 1])
    }, [currentSoftware])

    useEffect(() => {
        const selected = softwares.find(e => e.id === currentSoftware)
        if (!selected || !currentMajor || !selected.versions[currentMajor]) return

        if (selected.versions[currentMajor].length === 0) {
            loading.requestIntent("Fetching Versions", "FETCH_MINORS")
            const req = new APIRequest(`/versions/${currentSoftware}/${currentMajor}`).addCredentials()
            req.get().then((r) => {
                const newSoftwares = softwares.slice().map(s => {
                    if (s.id !== currentSoftware) return s
                    s.versions[currentMajor] = r.data
                    return s
                })
                setSoftwares(newSoftwares)
                setCurrentMinor(r.data[r.data.length - 1])
                loading.finishIntent("FETCH_MINORS")
            })
            return
        }

        setCurrentMinor(selected.versions[currentMajor][selected.versions[currentMajor].length - 1])
    }, [currentMajor, currentSoftware])

    return [
        softwares,
        {
            selectedSoftware,
            setCurrentSoftware,
            currentMinor,
            setCurrentMinor,
            currentMajor,
            setCurrentMajor
        },
        reset
    ]
}


interface IButtonProps {
    reset(): void,
    create(): void
}


const Buttons: React.FC<IButtonProps> = ({create, reset}) => {

    return <ButtonRow className={styles.buttons} justify={"space-between"}>
        <Button type={"secondary"} onClick={reset}>
            Reset
        </Button>
        <Button type={"primary"} onClick={create}>
            Create Server
        </Button>
    </ButtonRow>
}


export const ServerCreation: React.FC = () => {

    const info = useInfo()
    const alert = useAlert()
    const loading = useLoading()
    const servers = useServers()

    const [softwares, data, resetVersion] = useServerVersions()
    const [javaVersion, setJavaVersion] = useState(Object.keys(info.javaVersions)[0])
    const [ram, setRam] = useState(1)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    if (!data.selectedSoftware || !data.currentMinor || !data.currentMajor || !data.selectedSoftware.versions[data.currentMajor]) {
        return <></>
    }

    function createServer() {
        if (!data.selectedSoftware) {
            alert.alert({
                message: "No Server Software",
                description: "Please select a server software",
                type: "warning"
            })
            return
        }

        if (!data.currentMajor) {
            alert.alert({
                message: "No Major Version",
                description: "Please select a major version",
                type: "warning"
            })
            return
        }

        if (!data.currentMinor) {
            alert.alert({
                message: "No Minor Version",
                description: "Please select a minor software",
                type: "warning"
            })
            return
        }

        if (!name) {
            alert.alert({
                message: "No Server Name",
                description: "Please enter the name for your server",
                type: "warning"
            })
            return
        }

        loading.requestIntent("Creating Server", "CREATE_SERVER")
        API_createServer(data.selectedSoftware.id, data.currentMajor, data.currentMinor, name, 25565, ram, javaVersion, description).then(r => {
            alert.alert({
                message: "Server created",
                description: `Your server "${name}" has been created successfully`,
                type: "success"
            })

            // set new server as current, redirects to the server overview
            servers.setCurrentServer(r.data.add.server.id)
            loading.finishIntent("CREATE_SERVER")
        })
    }

    function reset() {
        resetVersion()
        setRam(1)
        setJavaVersion(Object.keys(info.javaVersions)[0])
        setName("")
        setDescription("")
    }

    return <>
        <Headline>Create Server</Headline>
        <div className={styles.container}>
            <SoftwareSelection softwares={softwares} setCurrentSoftware={data.setCurrentSoftware} selectedSoftware={data.selectedSoftware} />
            <VersionSelection currentSoftware={data.selectedSoftware} setCurrentMajor={data.setCurrentMajor} setCurrentMinor={data.setCurrentMinor} currentMajor={data.currentMajor} currentMinor={data.currentMinor} javaVersion={javaVersion} setJavaVersion={setJavaVersion} />
            <DetailsSelection description={description} setDescription={setDescription} name={name} setName={setName} />
            <RAMSelection setCurrentRam={setRam} currentRam={ram} />
            <Buttons create={createServer} reset={reset} />
        </div>
    </>
}
