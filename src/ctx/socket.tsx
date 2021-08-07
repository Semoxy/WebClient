import React, {useContext, useEffect, useRef, useState} from "react"
import {useAuth} from "./auth";
import {Packet} from "../services/socket";
import {useError} from "./error";
import {Action} from "../services/socket";
import {useUniqueId} from "../hooks";

type OnMessageCallback = (data: Packet) => void

type Callbacks = {
    [_: string]: {
        [_: string]: OnMessageCallback
    }
}

interface SocketContextProps {
    registerCallback(callback: OnMessageCallback, action: Action, identifier: string): void,
    unregisterCallback(action: Action, identifier: string): void,
    authenticated: boolean
}

const SocketContext = React.createContext<SocketContextProps>({
    authenticated: false,
    registerCallback() { },
    unregisterCallback() { }
})

export const SocketProvider: React.FC = ({children}) => {
    const [authenticated, setAuthenticated] = useState(false)

    const callbacks = useRef<Callbacks>({})
    const socket = useRef<WebSocket>()
    const mounted = useRef(true)

    const auth = useAuth()
    const error = useError()

    useEffect(() => {
        // connect the websocket on mount
        reconnectWebsocket()

        return () => {
            mounted.current = false

            // close socket on unmount
            socket.current?.close()
        }
    }, [])

    function reconnectWebsocket() {
        // return when a socket is currently connecting
        if ([0, 3].includes(socket.current?.readyState as number)) {
            return
        }

        // close websocket when one is open
        if (socket.current?.readyState === 1) {
            socket.current.close()
        }

        socket.current = new WebSocket(`ws://${window.location.host}/api/server/events`)

        socket.current.onopen = () => {
            // authenticate as the socket opens
            socket.current?.send(JSON.stringify({
                action: "AUTHENTICATE",
                data: {
                    sessionId: auth.sessionId
                }
            }))
        }

        socket.current.onmessage = (e) => {
            let data: Packet = JSON.parse(e.data)
            console.log(data)

            if (!callbacks.current[data.action]) {
                return
            }

            Object.values(callbacks.current[data.action]).forEach(c => c(data))
        }

        socket.current.onclose = (e) => {
            console.log("Socket Closed")
            // push error when the socket wasn't closed by the client
            if (e.code !== 1000 && e.code !== 1006) return
            error.pushError({
                name: "WebSocket closed",
                description: "",
                retryCallback(): boolean {
                    reconnectWebsocket()
                    return true
                }
            })
        }
    }

    function registerCallback(callback: OnMessageCallback, action: Action, identifier: string): void {
        if (!callbacks.current[action]) {
            callbacks.current[action] = {}
        }

        callbacks.current[action][identifier] = callback
    }

    function unregisterCallback(action: Action, identifier: string) {
        if (Object.keys(callbacks.current).length === 0) return
        delete callbacks.current[action][identifier]
    }

    const value = {
        registerCallback,
        unregisterCallback,
        authenticated
    }

    useSocketMessage(() => {
        setAuthenticated(true)
        console.log("Socket Logged In")
    }, "AUTH_SUCCESS", value)

    useSocketMessage(() => {
        error.pushError({
            name: "WebSocket authentication failed",
            description: "",
            retryCallback(): boolean {
                reconnectWebsocket()
                return true
            }
        })
    }, "AUTH_ERROR", value)

    return <SocketContext.Provider value={value}>
        {children}
    </SocketContext.Provider>
}

/**
 * A custom hook for listening to websocket messages.
 * @param callback the callback to call on the specific action.
 * @param action the action to call the callback on.
 * @param context a custom context (useful for using this hook INSIDE the context provider)
 */
export function useSocketMessage<T extends Packet>(callback: (packet: T) => void, action: Action, context?: SocketContextProps) {
    let socket = useSocket()
    socket = context || socket
    const identifier = useUniqueId("socket-subscriber")

    useEffect(() => {
        let id = identifier + ":" + action

        socket.registerCallback(callback as (_: Packet) => void, action, id)

        return () => socket.unregisterCallback(action, id)
    })
}

export const useSocket = () => {
    return useContext(SocketContext)
}

export default SocketContext
