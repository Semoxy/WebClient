import styles from "./navigation.module.css"
import React from "react"
import {ServerSelection} from "./serverselection"
import { NavLink } from "react-router-dom"
import {useServers} from "../../ctx/server"
import {
    AddonIcon,
    BackupIcon,
    ConsoleIcon,
    DashboardIcon, DSMIcon, NewServerIcon,
    OverviewIcon,
    PlayerIcon,
    SettingsIcon, UserIcon, WorldIcon
} from "../semoxy/icons"
import {useDesign} from "../../ctx/design"
import {concatClasses} from "../../util"


export const Navigation: React.FC = () => {
    const server = useServers().currentServer
    const design = useDesign()

    return <nav className={concatClasses(styles.nav, !design.contentShown && styles.full)}>
        { server && <ServerSelection /> }
        <NavigationSection>
            <NavigationItem text={"Dashboard"} icon={<OverviewIcon />} redirect={"/dashboard"} />
        </NavigationSection>
        { server && <NavigationSection title={"Current Server"}>
            <NavigationItem text={"Overview"} icon={<DashboardIcon />} redirect={`/server/${server.id}`} exact />
            <NavigationItem text={"Players"} icon={<PlayerIcon />} redirect={`/server/${server.id}/players`} />
            <NavigationItem text={"Console"} icon={<ConsoleIcon />} redirect={`/server/${server.id}/console`} />
            <NavigationItem text={"Backups"} icon={<BackupIcon />} redirect={`/server/${server.id}/backups`} />
            <NavigationItem text={"Settings"} icon={<SettingsIcon />} redirect={`/server/${server.id}/settings`} />
            <NavigationItem text={"Addons"} icon={<AddonIcon />} redirect={`/server/${server.id}/addons`} />
            <NavigationItem text={"Worlds"} icon={<WorldIcon />} redirect={`/server/${server.id}/worlds`} />
            <NavigationItem text={"DSM"} icon={<DSMIcon />} redirect={`/server/${server.id}/dsm`} />
        </NavigationSection> }
        <NavigationSection title={"General"}>
            <NavigationItem text={"Users"} icon={<UserIcon />} redirect={"/users"} />
            <NavigationItem text={"Create Server"} icon={<NewServerIcon />} redirect={"/server/new"} />
            <NavigationItem text={"Semoxy Settings"} icon={<SettingsIcon />} redirect={"/settings"} />
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
    text: string,
    icon?: JSX.Element,
    redirect: string,
    exact?: boolean
}


const NavigationItem: React.FC<INavigationItemProps> = ({text, icon, redirect, exact}) => {
    const design = useDesign()

    icon = React.cloneElement(icon as JSX.Element, {
        className: styles.icon
    })

    return <NavLink className={styles.item} to={redirect} activeClassName={styles.selected} exact={exact} onClick={() => design.setNavbarOpen(false)}>
        {icon}
        <span>{text}</span>
    </NavLink>
}
