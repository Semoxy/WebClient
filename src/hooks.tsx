import {useEffect, useRef, useState} from "react";
import { getSessionInformation } from "./services/session";
import { useLoading } from "./ctx/loading/loading";


export function useStorage(key: string, storage: Storage = localStorage, def: string | null = null): [string | null, (val: string | null) => void] {
    const [state, setState] = useState<string | null>(storage.getItem(key) || def);

    useEffect(() => {
        if (state === null) {
            storage.removeItem(key)
            return
        }
        storage.setItem(key, state);
    }, [state, key, storage])

    return [state, setState]
}

const idCounter: {[x: string]: number} = {}

export function useUniqueId(prefix: string = "component"): string {
    const firstRender = useRef(true)

    useEffect(() => {
        firstRender.current = false
    }, [])

    let idToUse = "";
    if (firstRender.current) {
        if (!idCounter[prefix]) {
            idCounter[prefix] = 0
        }
        idToUse = `${prefix}-${idCounter[prefix]++}`
    }

    return useRef<string>(idToUse).current
}

export function useMouseDown(): [boolean, () => void] {
    const [mouseDown, setMouseDown] = useState(false)

    useEffect(() => {
        function mouseUpListener() {
            setMouseDown(false)
        }

        window.addEventListener("mouseup", mouseUpListener)

        return () => {
            window.removeEventListener("mouseup", mouseUpListener)
        }
    }, [])

    return [mouseDown, () => {
        setMouseDown(true)
    }]
}

export function useSession(): [string | null, (s: string) => void, boolean, boolean, string | null] {
    const [sessionId, setSessionId] = useStorage("Semoxy_Session")
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [userId, setUserId] = useState<string | null>(null)

    const loader = useLoading()

    useEffect(() => {
        loader.requestIntent("Checking Session", "CHECK_SESSION")
        setLoading(true)
        if (!sessionId) {
            setUserId(null)
            setLoggedIn(false)
            loader.finishIntent("CHECK_SESSION")
            setLoading(false)
            return
        }
        getSessionInformation().then(i => {
            setUserId(i.userId)
            setLoggedIn(i.loggedIn)
            setLoading(false)
        }).catch(() => {
            setUserId(null)
            setLoggedIn(false)
            setLoading(false)
        });
        loader.finishIntent("CHECK_SESSION")
    }, [sessionId])

    return [sessionId, setSessionId, isLoggedIn, loading, userId]
}
