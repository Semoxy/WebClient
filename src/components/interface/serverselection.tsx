import React, {ChangeEvent} from "react";
import styles from "./serverselection.module.css"
import {useServers} from "../../ctx/server";

export const ServerSelection: React.FC = () => {
    const servers = useServers()

    function switchServer(e: ChangeEvent<HTMLSelectElement>) {
        if (!e.currentTarget.value) return

        servers.setCurrentServer(e.currentTarget.value)
    }

    return <select className={styles.select} onChange={switchServer}>
        {servers.servers.map((s) => <option key={s.name} value={s.id}>{s.displayName}</option>)}
    </select>
}