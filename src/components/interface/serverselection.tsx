import React, {ChangeEvent, useEffect, useRef} from "react";
import styles from "./serverselection.module.css"
import {useServers} from "../../ctx/server";
import {useHistory} from "react-router";

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

    function switchServer(e: ChangeEvent<HTMLSelectElement>) {
        if (!e.currentTarget.value) return
        servers.setCurrentServer(e.currentTarget.value)
    }

    useEffect(() => {
        rerouteToServerId(servers.currentServer?.id)
        lastId.current = servers.currentServer?.id
    }, [servers])

    return <select className={styles.select} onChange={switchServer}>
        {servers.servers.map((s) => <option key={s.name} value={s.id}>{s.displayName}</option>)}
    </select>
}
