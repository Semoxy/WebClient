import React from "react"
import {Server} from "../../services/server"
import styles from "./onlinePlayers.module.css"
import { getPlayerHeadUrlByName } from "../../services/players"
import {useServers} from "../../ctx/server"
import emptyStyles from "./empty.module.css"
import {CopyButton} from "../../components/copy/copy"
import {useInfo} from "../../ctx/info"

interface IOnlinePlayerEntryProps {
    player: string,
    server: Server
}


const OnlinePlayerEntry: React.FC<IOnlinePlayerEntryProps> = ({server, player}) => {
    return <li className={styles.content}>
        <img src={getPlayerHeadUrlByName(player)} alt={`${player}'s Head`} />
        <div className={styles.texts}>
            <span className={styles.name}>{player}</span>
            <span className={styles.status}>Playing on "{server.displayName}"</span>
        </div>
    </li>
}


interface IEmptyStateProps {
    title: string,
    description?: string,
    image?: JSX.Element
}

export const EmptyState: React.FC<IEmptyStateProps> = ({title, description, image, children}) => {
    return <div className={emptyStyles.container}>
        {image}
        <h4>{title}</h4>
        { description && <span>{description}</span> }
        <div className={emptyStyles.children}>
            { children }
        </div>
    </div>
}


export const OnlinePlayerList: React.FC = () => {
    const servers = useServers()
    const info = useInfo()

    let players: {name: string, server: Server}[] = []

    for (let s of servers.servers) {
        players = players.concat(s.onlinePlayers.map(p => {
            return {
                server: s,
                name: p
            }
        }))
    }

    const elements = players.map(op => <OnlinePlayerEntry key={`${op.server.name}:${op.name}`} player={op.name} server={op.server} />)

    return <ul className={styles.list}>
        {(players.length > 0) ? elements : <li>
            <EmptyState
                title={"No Players"}
                description={servers.servers.some(s => s.onlineStatus !== 0) ? "Get someone in here!" : "Start a server and get someone in here!"}>
                <CopyButton copyText={info.publicIP} alert={{
                    type: "success",
                    message: "Copied Server IP"
                }} buttonText={"Copy IP"} type={"secondary"} border />
            </EmptyState>
        </li>}
    </ul>
}
