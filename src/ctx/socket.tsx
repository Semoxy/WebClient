import React, {useContext, useEffect, useRef, useState} from "react"
import {useAuth} from "./auth";
import {Packet} from "../services/socket";
import {useError} from "./error";
import {Action} from "../services/socket";

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
    const [callbacks, setCallbacks] = useState<Callbacks>({})
    const [authenticated, setAuthenticated] = useState(false)

    const socket = useRef<WebSocket>()
    const unmounted = useRef(false)

    const auth = useAuth()
    const error = useError()

    function handlePacket(e: MessageEvent) {
        let data: Packet = JSON.parse(e.data)

        switch (data.action) {
            case "AUTH_SUCCESS":
                setAuthenticated(true)
                console.log("Socket Ready")
                break
            case "AUTH_ERROR":
                error.pushError({
                    name: "WebSocket authentication failed",
                    description: "",
                    retryCallback(): boolean {
                        reconnectWebsocket()
                        return true
                    }
                })
                break
        }

        if (!callbacks[data.action]) {
            return
        }

        // run callbacks
        Object.values(callbacks[data.action]).forEach(c => c(data))
    }

    useEffect(() => {
        if (!socket.current) return
        // update the current onmessage when the callbacks change
        socket.current.onmessage = handlePacket
    }, [callbacks])

    useEffect(() => {
        // connect the websocket on mount
        reconnectWebsocket()

        return () => {
            // close socket on unmount
            unmounted.current = true
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

        console.log("Open Socket")
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

        socket.current.onclose = (e) => {
            setAuthenticated(false)
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
        let newCallbacks = Object.assign({}, callbacks)

        if (!newCallbacks[action]) {
            newCallbacks[action] = {}
        }

        newCallbacks[action][identifier] = callback
        setCallbacks(newCallbacks)
    }

    function unregisterCallback(action: Action, identifier: string) {
        if (Object.keys(callbacks).length === 0) return

        let newCallbacks = Object.assign({}, callbacks)

        delete newCallbacks[action][identifier]

        setCallbacks(newCallbacks)
    }

    return <SocketContext.Provider value={{
        registerCallback,
        unregisterCallback,
        authenticated
    }}>
        {children}
    </SocketContext.Provider>
}

/**
 * A custom hook for listening to websocket messages.
 * @param callback the callback to call on the specific action.
 * @param action the action to call the callback on.
 * @param identifier a unique identifier for the component. In most cases this can be the component name.
 */
export function useSocketMessage<T extends Packet>(callback: (packet: T) => void, action: Action, identifier: string) {
    const socket = useSocket()

    useEffect(() => {
        let id = identifier + ":" + action

        socket.registerCallback(callback as (_: Packet) => void, action, id)

        return () => socket.unregisterCallback(action, id)
    }, [])
}

export const useSocket = () => {
    return useContext(SocketContext)
}

export default SocketContext
