import styles from "./navigation.module.css"
import React, {useState} from "react";
import {ServerSelection} from "./serverselection";
import {useHistory} from "react-router";
import {useServers} from "../../ctx/server";
import {
    AddonIcon,
    BackupIcon,
    ConsoleIcon,
    DashboardIcon, DSMIcon, NewServerIcon,
    OverviewIcon,
    PlayerIcon,
    SettingsIcon, UserIcon, WorldIcon
} from "../semoxy/icons";


// TODO: select initial item based on URL
export const Navigation: React.FC = () => {
    const server = useServers().currentServer
    const [selected, setSelected] = useState(0)

    return <nav className={styles.nav}>
        <ServerSelection />
        <NavigationSection>
            <NavigationItem text={"Dashboard"} icon={<OverviewIcon />} redirect={"/dashboard"} currentIndex={selected} setCurrentIndex={setSelected} index={0} />
        </NavigationSection>
        <NavigationSection title={"Current Server"}>
            <NavigationItem text={"Overview"} icon={<DashboardIcon />} redirect={`/server/${server?.id}`} currentIndex={selected} setCurrentIndex={setSelected} index={1} />
            <NavigationItem text={"Players"} icon={<PlayerIcon />} redirect={`/server/${server?.id}/players`} currentIndex={selected} setCurrentIndex={setSelected} index={2} />
            <NavigationItem text={"Console"} icon={<ConsoleIcon />} redirect={`/server/${server?.id}/console`} currentIndex={selected} setCurrentIndex={setSelected} index={3} />
            <NavigationItem text={"Backups"} icon={<BackupIcon />} redirect={`/server/${server?.id}/backups`} currentIndex={selected} setCurrentIndex={setSelected} index={4} />
            <NavigationItem text={"Settings"} icon={<SettingsIcon />} redirect={`/server/${server?.id}/settings`} currentIndex={selected} setCurrentIndex={setSelected} index={5} />
            <NavigationItem text={"Addons"} icon={<AddonIcon />} redirect={`/server/${server?.id}/addons`} currentIndex={selected} setCurrentIndex={setSelected} index={6} />
            <NavigationItem text={"Worlds"} icon={<WorldIcon />} redirect={`/server/${server?.id}/worlds`} currentIndex={selected} setCurrentIndex={setSelected} index={7} />
            <NavigationItem text={"DSM"} icon={<DSMIcon />} redirect={`/server/${server?.id}/dsm`} currentIndex={selected} setCurrentIndex={setSelected} index={8} />
        </NavigationSection>
        <NavigationSection title={"General"}>
            <NavigationItem text={"Users"} icon={<UserIcon />} redirect={"/users"} currentIndex={selected} setCurrentIndex={setSelected} index={9} />
            <NavigationItem text={"Create Server"} icon={<NewServerIcon />} redirect={"/server/new"} currentIndex={selected} setCurrentIndex={setSelected} index={10} />
            <NavigationItem text={"Semoxy Settings"} icon={<SettingsIcon />} redirect={"/settings"} currentIndex={selected} setCurrentIndex={setSelected} index={11} />
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
    icon?: JSX.Element | string,
    onClick?(): void,
    redirect?: string,
    index: number,
    currentIndex: number,
    setCurrentIndex(i: number): void
}


const NavigationItem: React.FC<INavigationItemProps> = ({index, currentIndex, setCurrentIndex, text, icon, onClick, redirect}) => {
    const history = useHistory()

    // issue: click users, F5, change server in dropdown
    if (history.location.pathname === redirect) {
        setCurrentIndex(index)
    }
    const selected = currentIndex === index

    const classNames = [styles.item]
    selected && classNames.push(styles.selected)

    function _onClick() {
        setCurrentIndex(index)
        onClick && onClick()
        redirect && history.push(redirect)
    }

    icon = React.cloneElement(icon as JSX.Element, {
        className: styles.icon,
        selected: selected
    })

    return <div onClick={_onClick} className={classNames.join(" ")}>
        {icon}
        <span>{text}</span>
        { selected && <div className={styles.selectrect} /> }
    </div>
}
