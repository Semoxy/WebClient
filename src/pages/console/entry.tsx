import styles from "./entry.module.css"
import React from "react"
import {ServerEvent} from "../../services/server"
import {ConsoleCommandEvent, ConsoleMessageEvent} from "../../services/event"
import {getIdTimestamp} from "../../util"


const timeStampRemove = /^\[\d+:\d+:\d+ [A-Z]+]: /


export function getEventTime(event: ServerEvent<any>, includeDate?: boolean): string {
    let time = new Date(getIdTimestamp(event.id) * 1000)

    let out = ""

    if (includeDate) {
        out += `${time.getDate()}.`.padStart(3, "0") + `${time.getMonth()}. `.padStart(4, "0") + time.getFullYear() + " "
    }

    return out + `${time.getHours()}:`.padStart(3, "0") + `${time.getMinutes()}:`.padStart(3, "0") + `${time.getSeconds()}`.padStart(2, "0")
}


export const ConsoleMessage: React.FC<{event: ServerEvent<ConsoleMessageEvent>}> = ({event}) => {
    let msg = event.data.message.replace(timeStampRemove, "")

    return <div className={styles.entry}>
        {msg}
        <span className={styles.time}>{getEventTime(event)}</span>
    </div>
}

export const ConsoleCommand: React.FC<{event: ServerEvent<ConsoleCommandEvent>}> = ({event}) => {
    return <div className={styles.entry}>
        <span>
            <img alt={"Server Command"} src={"assets/cmd_block.png"} />
            {event.data.command}
        </span>
        <span className={styles.time}>{getEventTime(event)}</span>
    </div>
}
