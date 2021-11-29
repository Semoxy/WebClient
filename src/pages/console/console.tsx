import React, {UIEventHandler, useEffect, useRef, useState} from "react";
import styles from "./console.module.css"
import {Headline} from "../index";
import {useServers} from "../../ctx/server";
import {
    getEvents,
    sendServerCommand,
    ServerEvent,
    serverEventFromSocketEvent,
    startServer
} from "../../services/server";
import {ConsoleCommandEvent, ConsoleMessageEvent, ServerStartEvent, ServerStopEvent} from "../../services/event";
import {ConsoleCommand, ConsoleMessage} from "./entry";
import {ButtonRow} from "../../components/interface/boxes/box";
import Input from "../../components/input";
import Button from "../../components/button";
import {concatClasses, getIdTimestamp} from "../../util";
import {useSocketMessage} from "../../ctx/socket";
import {ServerEventPacket} from "../../services/socket";
import {EmptyState} from "../dashboard/onlinePlayers";
import {useStorage} from "../../hooks";
import {Event} from "../../services/event";
import {useAlert} from "../../ctx/alert/alertctx";


function useScrollBottom(offset: number): [boolean, UIEventHandler<HTMLDivElement>] {
    const [isAtBottom, setAtBottom] = useState(false)

    const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - offset) {
            setAtBottom(true)
        } else if (isAtBottom) {
            setAtBottom(false)
        }
    }

    return [isAtBottom, onScroll]
}


export const ConsoleView: React.FC = () => {
    const server = useServers()
    const [messages, setMessages] = useState<ServerEvent<Event>[]>([])
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [isAtBottom, onScroll] = useScrollBottom(15)
    const [serverStarting, setServerStarting] = useState(false)
    const [command, setCommand] = useStorage("Semoxy_Command", localStorage, "")
    const alert = useAlert()
    const [startEvent, setStartEvent] = useState<ServerEvent<ServerStartEvent>>()

    useSocketMessage((p: ServerEventPacket<ConsoleMessageEvent>) => {
        if (p.data.serverId !== server.currentServerId) return

        if (serverStarting) {
            setServerStarting(false)
        }

        let newMsgs = messages.slice()
        newMsgs.push(serverEventFromSocketEvent(p))
        setMessages(newMsgs)
    }, "CONSOLE_MESSAGE")

    useSocketMessage((p: ServerEventPacket<ConsoleCommandEvent>) => {
        if (p.data.serverId !== server.currentServerId) return

        const newMsgs = messages.slice()
        newMsgs.push(serverEventFromSocketEvent(p))
        setMessages(newMsgs)
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
        scrollToBottom()
    }, [messages])

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

    useEffect(() => {
        if (!server.currentServerId || !startEvent) return

        getEvents<ConsoleMessageEvent>(server.currentServerId, {
            amount: 256,
            min_time: getIdTimestamp(startEvent.id)
        }).then(e => {
            setMessages(e)
        })
    }, [startEvent])

    function sendCommand() {
        if (!command) return
        if (server.currentServer?.onlineStatus === 0) {
            alert.alert({
                type: "error",
                message: "Server Offline",
                description: "Your command could not be executed, because the server is offline",
            })
            return;
        }

        sendServerCommand(server.currentServerId as string, command).then(() => {
            setCommand(null)
        })
    }

    return <>
        <Headline>Server Console</Headline>
        <div className={styles.list} ref={scrollRef} onScroll={onScroll}>
            {messages.map(msg => {
                switch (msg.type) {
                    case "CONSOLE_MESSAGE":
                        return <ConsoleMessage key={msg.id} event={msg as ServerEvent<ConsoleMessageEvent>} />
                    case "CONSOLE_COMMAND":
                        return <ConsoleCommand key={msg.id} event={msg as ServerEvent<ConsoleCommandEvent>} />
                }
            }
            )}
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
