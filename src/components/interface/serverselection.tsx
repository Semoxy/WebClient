import React, {useEffect, useRef, useState} from "react";
import styles from "./serverselection.module.css"
import {useServers} from "../../ctx/server";
import {useHistory} from "react-router";
import {Server} from "../../services/server";

export const ServerSelection: React.FC = () => {
    const servers = useServers()
    const history = useHistory()

    const lastId = useRef<string | undefined>(servers.currentServer?.id)

    function rerouteToServerId(newId?: string) {
        if (!newId) return;

        // redirect to server overview when the server was switched but no server page is open or no previous server was selected
        if (!history.location.pathname.startsWith("/server") || !lastId.current) {
            history.replace(`/server/${newId}`)
            return;
        }

        let newRoute = history.location.pathname.slice()
        newRoute = newRoute.replace(lastId.current, newId)

        history.replace(newRoute)
    }

    function switchServer(newId: string) {
        if (!newId) return
        servers.setCurrentServer(newId)
    }

    useEffect(() => {
        rerouteToServerId(servers.currentServer?.id)
        lastId.current = servers.currentServer?.id
    }, [servers])

    return <ServerSelectionSelect onChange={switchServer} />
}

interface IServerSelectionSelectProps {
    onChange?(id: string): void
}

const ServerSelectionSelect: React.FC<IServerSelectionSelectProps> = ({onChange}) => {
    const [collapsed, setCollapsed] = useState(true)
    const server = useServers()
    const select = useRef<HTMLDivElement | null>(null)

    const classNames = [styles.select]
    if (!collapsed) classNames.push(styles.open)

    return <div tabIndex={0} className={classNames.join(" ")} onClick={() => setCollapsed(!collapsed)} ref={select} onBlur={() => setCollapsed(true)}>
        { server.currentServer && <ServerEntry server={server.currentServer} /> }
        <img className={styles["dropdown-arrow"]} src={"assets/arrow_down.svg"} alt={"Arrow Down"} />
        <div className={styles.dropdown}>
            {server.servers.map(s => s.id !== server.currentServer?.id && <ServerEntry key={s.id} server={s} onClick={() => onChange && onChange(s.id)} />)}
        </div>
    </div>
}

interface IServerEntryProps {
    server: Server,
    onClick?(): void
}

const ServerEntry: React.FC<IServerEntryProps> = ({server, onClick}) => {
    return <div className={styles.item} onClick={onClick}>
        <h3>{server.displayName}</h3>
        { server.description && <p>{server.description}</p> }
    </div>
}
