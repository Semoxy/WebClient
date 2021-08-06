import styles from "./navigation.module.css"
import React from "react";
import {ServerSelection} from "./serverselection";
import {useHistory} from "react-router";
import {useServers} from "../../ctx/server";


export const Navigation: React.FC = () => {
    const server = useServers().currentServer

    return <nav className={styles.nav}>
        <ServerSelection />
        <NavigationSection>
            <NavigationItem text={"Dashboard"} icon={"overview"} selected redirect={"/dashboard"} />
        </NavigationSection>
        <NavigationSection title={"Current Server"}>
            <NavigationItem text={"Overview"} icon={"dashboard"} redirect={`/server/${server?.id}`} />
            <NavigationItem text={"Players"} icon={"players"} redirect={`/server/${server?.id}/players`} />
            <NavigationItem text={"Console"} icon={"console"} redirect={`/server/${server?.id}/console`} />
            <NavigationItem text={"Backups"} icon={"backups"} redirect={`/server/${server?.id}/backups`} />
            <NavigationItem text={"Settings"} icon={"settings"} redirect={`/server/${server?.id}/settings`} />
            <NavigationItem text={"Addons"} icon={"addons"} redirect={`/server/${server?.id}/addons`} />
            <NavigationItem text={"Worlds"} icon={"worlds"} redirect={`/server/${server?.id}/worlds`} />
            <NavigationItem text={"DSM"} icon={"dsm"} redirect={`/server/${server?.id}/dsm`} />
        </NavigationSection>
        <NavigationSection title={"General"}>
            <NavigationItem text={"Users"} icon={"users"} redirect={"/users"} />
            <NavigationItem text={"Create Server"} icon={"newserver"} redirect={"/server/new"} />
            <NavigationItem text={"Semoxy Settings"} icon={"settings"} redirect={"/settings"} />
        </NavigationSection>
    </nav>
}


interface INavigationSectionProps {
    title?: string
}


const NavigationSection: React.FC<INavigationSectionProps> = ({title, children}) => {
    return <div className={styles.section}>
        { title && <h2>{title}</h2> }
        {children}
    </div>
}


interface INavigationItemProps {
    selected?: boolean,
    text: string,
    icon?: string,
    onClick?(): void,
    redirect?: string
}


const NavigationItem: React.FC<INavigationItemProps> = ({selected, text, icon, onClick, redirect}) => {
    const history = useHistory()

    const classNames = [styles.item]
    selected && classNames.push(styles.selected)

    // <img className={styles.icon} src={`icons/${icon}.svg`} alt={`${text}-Icon`} />

    function _onClick() {
        if (selected) return

        onClick && onClick()
        redirect && history.push(redirect)
    }

    return <div onClick={_onClick} className={classNames.join(" ")}>
        {/* @ts-ignore */}
        <img className={styles.icon} src={`icons/${icon}.svg`} alt={`${text}-Icon`} />
        <span>{text}</span>
        { selected && <div className={styles.selectrect} /> }
    </div>
}
