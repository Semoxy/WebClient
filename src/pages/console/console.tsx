import React, {UIEventHandler, useEffect, useRef, useState} from "react"
import styles from "./console.module.css"
import {Headline} from "../index"
import {useServers} from "../../ctx/server"
import {
    getEvents,
    sendServerCommand,
    ServerEvent,
    serverEventFromSocketEvent,
    startServer
} from "../../services/server"
import {ConsoleCommandEvent, ConsoleMessageEvent, ServerStartEvent, ServerStopEvent} from "../../services/event"
import {entryFromEvent} from "./entry"
import {ButtonRow} from "../../components/interface/boxes/box"
import Input from "../../components/input"
import Button from "../../components/button"
import {concatClasses, getIdTimestamp} from "../../util"
import {useSocketMessage} from "../../ctx/socket"
import {ServerEventPacket} from "../../services/socket"
import {EmptyState} from "../dashboard/onlinePlayers"
import {Event} from "../../services/event"
import {useAlert} from "../../ctx/alert/alertctx"
import {useCommandHistory, useScrollBottom} from "./hooks";


export const ConsoleView: React.FC = () => {
    const server = useServers()
    const [messages, setMessages] = useState<ServerEvent<Event>[]>([])
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [isAtBottom, scrollHookCallback] = useScrollBottom(15)
    const [serverStarting, setServerStarting] = useState(false)
    const alert = useAlert()
    const [startEvent, setStartEvent] = useState<ServerEvent<ServerStartEvent>>()
    const [command, commandSent, up, down, setCommand] = useCommandHistory()
    const fetchingMessages = useRef(false)
    const fetchedPage = useRef(0)
    const lastPage = useRef(false)

    useSocketMessage((p: ServerEventPacket<ConsoleMessageEvent>) => {
        if (p.data.serverId !== server.currentServerId) return

        if (serverStarting) {
            setServerStarting(false)
        }

        let newMsgs = messages.slice()
        newMsgs.push(serverEventFromSocketEvent(p))
        setMessages(newMsgs)
        scrollToBottom()
    }, "CONSOLE_MESSAGE")

    useSocketMessage((p: ServerEventPacket<ConsoleCommandEvent>) => {
        if (p.data.serverId !== server.currentServerId) return

        const newMsgs = messages.slice()
        newMsgs.push(serverEventFromSocketEvent(p))
        setMessages(newMsgs)
        scrollToBottom()
    }, "CONSOLE_COMMAND")

    useSocketMessage((p: ServerEventPacket<ServerStopEvent>) => {
        if (p.data.serverId !== server.currentServerId) return

        setMessages([])
    }, "SERVER_STOP")

    function scrollToBottom() {
        if (!scrollRef.current) return

        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }

    useEffect(() => {
        if (!server.currentServerId) return

        const serverId = server.currentServerId

        getEvents<ServerStartEvent>(serverId, {
            amount: 1,
            type: ["SERVER_START", "SERVER_STOP"],
            order: "desc"
        }).then(startEvents => {
            if (!startEvents.length || startEvents[0].type === "SERVER_STOP") {
                setMessages([])
                return
            }

            setStartEvent(startEvents[0])
        })
    }, [server.currentServerId])

    function fetchOlderMessages() {
        if (!server.currentServerId || !startEvent) return
        if (lastPage.current) return;

        if (fetchedPage.current === 0) {
            setMessages([])
        }

        fetchingMessages.current = true
        getEvents<ConsoleMessageEvent>(server.currentServerId, {
            amount: 16,
            min_time: getIdTimestamp(startEvent.id),
            order: "desc",
            page: fetchedPage.current
        }).then(e => {
            if (e.length === 0) {
                lastPage.current = true
            }

            const newMessages = messages.slice()
            newMessages.unshift(...e.reverse())
            setMessages(newMessages)
            fetchingMessages.current = false

            if (fetchedPage.current === 0) {
                scrollToBottom()
            }
        })
    }
    useEffect(fetchOlderMessages, [startEvent])

    function sendCommand() {
        if (!command) return
        if (server.currentServer?.onlineStatus === 0) {
            alert.alert({
                type: "error",
                message: "Server Offline",
                description: "Your command could not be executed, because the server is offline",
            })
            return
        }

        sendServerCommand(server.currentServerId as string, command).then(commandSent)
    }

    const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
        scrollHookCallback(e)

        const scrollProgress = e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight)
        if (scrollProgress < 0.45 && !fetchingMessages.current) {
            fetchingMessages.current = true
            fetchedPage.current++
            fetchOlderMessages()
        }
    }

    return <>
        <Headline>Server Console</Headline>
        <div className={styles.list} ref={scrollRef} onScroll={onScroll}>
            {messages.map(entryFromEvent)}
            { messages.length === 0 &&
                <EmptyState title={"No Console Messages"} description={server.currentServer?.onlineStatus === 0 ? "Start your Server to see some!" : "Wait for some to arrive"}>
                    { server.currentServer?.onlineStatus === 0 && <Button type={"primary"} loading={serverStarting} border onClick={() => {
                        setServerStarting(true)
                        startServer(server.currentServerId as string).then()
                    }}>
                        Start Server
                    </Button> }
                </EmptyState>
            }
        </div>
        <ButtonRow className={concatClasses(styles.buttons, !isAtBottom && styles.shadow)}>
            <Input
                onKeyPress={(e) => {
                    if (e.key === "Enter") {
                        sendCommand()
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowUp") {
                        e.preventDefault()
                        up()
                    } else
                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        down()
                    }
                }}
                type={"text"}
                placeholder={"Enter Command"}
                value={command || ""}
                onChange={(e) => setCommand(e.currentTarget.value)}
                expand />
            <Button
                onClick={sendCommand}
                type={"primary"}
                disabled={server.currentServer?.onlineStatus === 0}
            >Send</Button>
        </ButtonRow>
    </>
}
