import React, {useEffect, useState} from "react"
import {OverviewItem, OverviewItemList} from "../../components/interface/dashboardcards"
import {CPUIcon, PlayerOverviewIcon, RamIcon, UptimeIcon} from "../../components/semoxy/icons"
import {calculateUptime, formatTime, getIdTimestamp} from "../../util"
import {useServers} from "../../ctx/server"
import {Headline} from "../index"
import {BoxRow, ButtonRow, PageBox} from "../../components/interface/boxes/box"
import {LightHeading} from "../../components/interface/boxes/headline"
import styles from "./overview.module.css"
import {useInfo} from "../../ctx/info"
import {CopyField} from "../../components/copy/copy"
import Button, {ButtonType} from "../../components/button"
import Input from "../../components/input"
import {APIRequest} from "../../services"
import {Software} from "../serverCreation/serverCreation"
import {getEvents, restartServer, Server, startServer, stopServer} from "../../services/server"
import {useSocketMessage} from "../../ctx/socket"
import {ServerStateChangePacket} from "../../services/socket"


interface IServerStatusProps {
    status: number
}


const serverStatusNames = ["Offline", "Starting", "Online", "Stopping"]
export const serverStatusButtonTypes: ButtonType[] = ["danger", "warning", "online", "danger"]


export const ServerStatus: React.FC<IServerStatusProps> = ({status}) => {
    return <Button className={styles.status} type={serverStatusButtonTypes[status]} disabled>
        {serverStatusNames[status]}
    </Button>
}


function useCurrentServerVersion(): string {
    // todo: put versions into separate context
    const servers = useServers()
    const [softwareInfo, setSoftwareInfo] = useState<Software>()

    useEffect(() => {
        const r = new APIRequest("versions")
        r.addCredentials()
        r.get().then(r => {
            setSoftwareInfo(r.data.find((s: Software) => s.id === servers.currentServer?.software.server))
        })
    }, [servers.currentServerId])

    const software = servers.currentServer?.software

    return `${softwareInfo?.name || software?.server} ${software?.majorVersion} ${software?.minorVersion}`
}


interface IServerControlButtonsProps {
    server: Server,
    onStart?(): void
}


const ServerControlButtons: React.FC<IServerControlButtonsProps> = ({server, onStart}) => {
    return <ButtonRow>
        <Button onClick={() => {
            if (server.onlineStatus !== 0) {
                stopServer(server.id)
            } else {
                onStart && onStart()
                startServer(server.id)
            }
        }
        } type={"primary"} expand>{server.onlineStatus !== 0 ? "Stop" : "Start"}</Button>
        { server.onlineStatus !== 0 && <Button onClick={() => restartServer(server.id)} type={"secondary"} expand border>Restart</Button> }
    </ButtonRow>
}


export const ServerOverview: React.FC = () => {
    const servers = useServers()
    const info = useInfo()
    const serverVersion = useCurrentServerVersion()
    const [serverStartTime, setServerStartTime] = useState(Math.ceil(new Date().getTime() / 1000))
    const [uptime, setUptime] = useState("Loading..")

    useEffect(() => {
        if (servers.currentServer?.onlineStatus) {
            getEvents(servers.currentServer.id, {
                amount: 1,
                order: "desc",
                type: ["SERVER_START"]
            }).then(r => {
                if (!r.length) return
                setServerStartTime(getIdTimestamp(r[0].id))
            })
        }
    }, [])

    useEffect(() => {
        setUptime(formatTime(calculateUptime(serverStartTime)))
        const interval = setInterval(() => {
            setUptime(formatTime(calculateUptime(serverStartTime)))
        }, calculateUptime(info.startTime) > 3600 ? 5000 : 500)

        return () => clearInterval(interval)
    }, [serverStartTime])

    useSocketMessage((p: ServerStateChangePacket) => {
        if (p.data.patch.onlineStatus === 0) {
            setServerStartTime(0)
        } else
        if (p.data.patch.onlineStatus === 1) {
            setServerStartTime(Math.ceil(new Date().getTime() / 1000))
        }
    }, "SERVER_STATE_CHANGE")

    if (!servers.currentServer) {
        return <></>
    }

    let serverIp = info.publicIP
    servers.currentServer.port !== 25565 && (serverIp += `:${servers.currentServer.port}`)

    const ramUsage = (servers.currentServer.ramUsage / 1000000).toFixed(2)

    return <>
        <Headline>Server Overview</Headline>
        { !!servers.currentServer.onlineStatus &&
            <OverviewItemList>
                <OverviewItem title={"Player Count"} value={servers.currentServer.onlinePlayers.length + ""} icon={<PlayerOverviewIcon />} />
                <OverviewItem title={"RAM Usage"} value={`${ramUsage}/${servers.currentServer.allocatedRAM}GB`} icon={<RamIcon />} />
                <OverviewItem title={"CPU Usage"} value={`${servers.currentServer.cpuUsage || 0}%`} icon={<CPUIcon />} />
                <OverviewItem title={"Uptime"} value={uptime} icon={<UptimeIcon />} />
            </OverviewItemList>
        }
        <BoxRow>
            <PageBox>
                <LightHeading>Status</LightHeading>
                <CopyField label={"Server IP"} alert={{
                    type: "success",
                    message: "Copied Server IP"
                }} copyText={serverIp} expand />
                <ServerStatus status={servers.currentServer.onlineStatus} />
                <ServerControlButtons server={servers.currentServer} onStart={() => setServerStartTime(Math.ceil(new Date().getTime() / 1000))} />
            </PageBox>
            <PageBox>
                <LightHeading>Version</LightHeading>
                <Input label={"Minecraft Version"} value={servers.currentServer.software.minecraftVersion} expand readonly />
                <Input label={"Software"} value={serverVersion} expand readonly />
            </PageBox>
        </BoxRow>
    </>
}
