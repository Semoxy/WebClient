import React, {useEffect, useRef} from "react";
import styles from "./serverselection.module.css"
import {useServers} from "../../ctx/server";
import {useHistory} from "react-router";
import {Server} from "../../services/server";
import {DropDown} from "../dropdown/dropdown";

export const ServerSelection: React.FC = () => {
    const servers = useServers()
    const history = useHistory()
    const hasBeenSwitched = useRef(false)

    const lastId = useRef<string | undefined>(servers.currentServer?.id)

    function rerouteToServerId(newId?: string) {
        if (!newId) return;

        if (!history.location.pathname.startsWith("/server") && !hasBeenSwitched.current) {
            return;
        }

        // redirect to server overview when the server was switched but no server page is open or no previous server was selected
        if (!history.location.pathname.startsWith("/server") || !lastId.current) {
            history.replace(`/server/${newId}`)
            return;
        }

        let newRoute = history.location.pathname.slice()
        newRoute = newRoute.replace(lastId.current, newId)

        history.push(newRoute)
    }

    function switchServer(newId: string) {
        if (!newId) return
        hasBeenSwitched.current = true
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
    const server = useServers()

    return <DropDown currentItem={<ServerEntry server={server.currentServer} />} tabIndex={0} className={styles.dropdown}>
        {server.servers.map(s => s.id !== server.currentServer?.id && <ServerEntry key={s.id} server={s} data-id={s.id} onClick={() => onChange && onChange(s.id)} />)}
    </DropDown>
}

interface IServerEntryProps {
    server: Server | null,
    onClick?(): void
}

const ServerEntry: React.FC<IServerEntryProps> = ({server, onClick}) => {
    return <div className={styles.item} onClick={onClick}>
        <h3>{server?.displayName}</h3>
        { server?.description && <p>{server.description}</p> }
    </div>
}
