import React from "react"
import {useServers} from "../../ctx/server"
import {restartServer, Server, stopServer} from "../../services/server"
import styles from "./onlineServers.module.css"
import {EmptyState} from "./onlinePlayers"
import Button from "../../components/button"
import {useHistory} from "react-router"
import {GoToIcon, RestartIcon, StopIcon} from "../../components/semoxy/icons"
import {concatClasses} from "../../util"
import {serverStatusButtonTypes} from "../server/overview"


const ServerStopButton: React.FC<{server: Server}> = ({server}) => {
    return <div title={"Stop Server"}>
        <StopIcon onClick={() => stopServer(server.id)} className={styles.button} />
    </div>
}


const ServerRestartButton: React.FC<{server: Server}> = ({server}) => {
    return <div title={"Restart Server"}>
        <RestartIcon onClick={() => restartServer(server.id)} className={styles.button} />
    </div>
}


const GoToServerPageButton: React.FC<{server: Server}> = ({server}) => {
    const history = useHistory()

    return <div title={"Go to Server Page"}>
        <GoToIcon onClick={() => history.push(`/server/${server.id}`)} className={styles.button} />
    </div>
}


const ServerListEntry: React.FC<{server: Server}> = ({server}) => {
    return <li className={styles.item}>
        <div className={styles.texts}>
            <span className={styles.name}>{server.displayName}</span>
            { server.description && <span className={styles.description}>{server.description}</span> }
        </div>
        <div className={styles.buttons}>
            <ServerStopButton server={server} />
            <ServerRestartButton server={server} />
            <GoToServerPageButton server={server} />
        </div>
        <div className={concatClasses(styles.playercount, styles[serverStatusButtonTypes[server.onlineStatus]])}>
            <span>{server.onlinePlayers.length}/{20}</span>
        </div>
    </li>
}


export const OnlineServerList: React.FC = () => {
    const servers = useServers()
    const history = useHistory()

    const onlineServers = servers.servers.filter(server => server.onlineStatus !== 0)

    return <ul className={styles.list}>
        {onlineServers.length > 0 ?
            onlineServers.map(server => <ServerListEntry key={server.id} server={server} />)
        :
            <EmptyState title={"No Online Servers"} description={"Begin by starting a server"}>
                <Button onClick={() => history.push(`/server/${servers.currentServerId}`)} type={"secondary"} border>
                    Visit Server Page
                </Button>
            </EmptyState>
        }
    </ul>
}
