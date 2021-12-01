import React, {useEffect, useState} from "react"
import {Headline} from "../index"
import {CPUIcon, PlayerOverviewIcon, RamIcon, UptimeIcon} from "../../components/semoxy/icons"
import {useInfo} from "../../ctx/info"
import {useServers} from "../../ctx/server"
import {calculateUptime, formatTime} from "../../util"
import {OverviewItem, OverviewItemList} from "../../components/interface/dashboardcards"
import {BoxRow, PageBox} from "../../components/interface/boxes/box"
import {LightHeading} from "../../components/interface/boxes/headline"
import {OnlineServerList} from "./onlineServers"
import {OnlinePlayerList} from "./onlinePlayers"


function useUptime(): number {
    const info = useInfo()
    const [uptimeOut, setUptimeOut] = useState(calculateUptime(info.startTime))

    useEffect(() => {
        const interval = setInterval(() => {
            setUptimeOut(calculateUptime(info.startTime))
        }, calculateUptime(info.startTime) > 3600 ? 5000 : 500)

        return () => clearInterval(interval)
    }, [])

    return uptimeOut
}


function useTotalOnlinePlayers(): number {
    const servers = useServers()

    return servers.servers.reduce((total, current) => {
        return total + current.onlinePlayers.length
    }, 0)
}


const DashboardTiles: React.FC = () => {
    const uptime = useUptime()
    const playerCount = useTotalOnlinePlayers()
    const info = useInfo()

    const ramUsage = (info.ramUsage / 1000000).toFixed(2)
    const systemRam = (info.systemRAM / 1000000).toFixed(0)

    return <OverviewItemList>
        <OverviewItem title={"Total Players"} value={playerCount + ""} icon={<PlayerOverviewIcon />} />
        <OverviewItem title={"RAM Usage"} value={`${ramUsage}/${systemRam}GB`} icon={<RamIcon />} />
        <OverviewItem title={"CPU Usage"} value={`${info.cpuUsage.toFixed(2)}%`} icon={<CPUIcon />} />
        <OverviewItem title={"Uptime"} value={formatTime(uptime)} icon={<UptimeIcon />} />
    </OverviewItemList>
}


export const Dashboard: React.FC = () => {
    return <>
        <Headline>Dashboard</Headline>
        <DashboardTiles />
        <BoxRow>
            <PageBox>
                <LightHeading>Online Servers</LightHeading>
                <OnlineServerList />
            </PageBox>
            <PageBox>
                <LightHeading>Online Players</LightHeading>
                <OnlinePlayerList />
            </PageBox>
        </BoxRow>
    </>
}
