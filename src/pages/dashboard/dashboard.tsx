import React, {useEffect, useState} from "react";
import {Headline} from "../index";
import styles from "./dashboard.module.css"
import {CPUIcon, PlayerOverviewIcon, RamIcon, UptimeIcon} from "../../components/semoxy/icons";
import {useInfo} from "../../ctx/info";
import {useServers} from "../../ctx/server";


interface IOverviewItemProps {
    title: string,
    value: string,
    icon: JSX.Element
}


export const OverviewItem: React.FC<IOverviewItemProps> = ({icon, value, title}) => {
    return <div className={styles.item}>
        <div className={styles.icon}>
            {icon}
        </div>
        <div className={styles.text}>
            <h5>{title}</h5>
            <p>{value}</p>
        </div>
    </div>
}


export const OverviewItemList: React.FC = ({children}) => {
    return <div className={styles["icon-area"]}>
        {children}
    </div>
}


function calculateUptime(start: number): string {
    return `${Math.round((new Date().getTime() / 1000) - start)}`
}


function useUptime(): string {
    const info = useInfo()
    const [uptimeOut, setUptimeOut] = useState(calculateUptime(info.startTime))

    useEffect(() => {
        const interval = setInterval(() => setUptimeOut(calculateUptime(info.startTime)), 5000)
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


export const Dashboard: React.FC = () => {

    const uptime = useUptime()
    const playerCount = useTotalOnlinePlayers()

    return <div>
        <Headline>Dashboard</Headline>
        <OverviewItemList>
            <OverviewItem title={"Total Players"} value={playerCount + ""} icon={<PlayerOverviewIcon />} />
            <OverviewItem title={"RAM Usage"} value={"4.5/32GB"} icon={<RamIcon />} />
            <OverviewItem title={"CPU Usage"} value={"68%"} icon={<CPUIcon />} />
            <OverviewItem title={"Uptime"} value={uptime} icon={<UptimeIcon />} />
        </OverviewItemList>
    </div>
}
