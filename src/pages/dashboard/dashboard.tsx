import React from "react";
import {Headline} from "../index";
import styles from "./dashboard.module.css"
import {CPUIcon, PlayerOverviewIcon, RamIcon, UptimeIcon} from "../../components/semoxy/icons";


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


export const Dashboard: React.FC = () => {
    return <div>
        <Headline>Dashboard</Headline>
        <OverviewItemList>
            <OverviewItem title={"Total Players"} value={"15"} icon={<PlayerOverviewIcon />} />
            <OverviewItem title={"RAM Usage"} value={"4.5/32GB"} icon={<RamIcon />} />
            <OverviewItem title={"CPU Usage"} value={"68%"} icon={<CPUIcon />} />
            <OverviewItem title={"Uptime"} value={"1d, 9h"} icon={<UptimeIcon />} />
        </OverviewItemList>
    </div>
}
