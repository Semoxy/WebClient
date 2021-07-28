import styles from "./navigation.module.css"
import React from "react";
import {ServerSelection} from "./serverselection";


export const Navigation: React.FC = () => {
    return <nav className={styles.nav}>
        <ServerSelection />
        <NavigationSection>
            <NavigationItem text={"Dashboard"} icon={"overview"} selected />
        </NavigationSection>
        <NavigationSection title={"Current Server"}>
            <NavigationItem text={"Overview"} icon={"dashboard"} />
            <NavigationItem text={"Players"} icon={"players"} />
            <NavigationItem text={"Console"} icon={"console"} />
            <NavigationItem text={"Backups"} icon={"backups"} />
            <NavigationItem text={"Settings"} icon={"settings"} />
            <NavigationItem text={"Addons"} icon={"addons"} />
            <NavigationItem text={"Worlds"} icon={"worlds"} />
            <NavigationItem text={"DSM"} icon={"dsm"} />
        </NavigationSection>
        <NavigationSection title={"General"}>
            <NavigationItem text={"Users"} icon={"users"} />
            <NavigationItem text={"Create Server"} icon={"newserver"} />
            <NavigationItem text={"Semoxy Settings"} icon={"settings"} />
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
    onClick?(): void
}


const NavigationItem: React.FC<INavigationItemProps> = ({selected, text, icon, onClick}) => {
    const classNames = [styles.item]
    selected && classNames.push(styles.selected)

    // <img className={styles.icon} src={`icons/${icon}.svg`} alt={`${text}-Icon`} />

    return <div onClick={onClick} className={classNames.join(" ")}>
        {/* @ts-ignore */}
        <img className={styles.icon} src={`icons/${icon}.svg`} alt={`${text}-Icon`} />
        <span>{text}</span>
        { selected && <div className={styles.selectrect} /> }
    </div>
}
