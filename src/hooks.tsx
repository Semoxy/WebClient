import { useEffect, useState } from "react";
import {getSessionInformation} from "./services/session";

export function useStorage(key: string, storage: Storage = localStorage): [string | null, (val: string) => void] {
    const [state, setState] = useState<string | null>(storage.getItem(key));

    useEffect(() => {
        if (state === null) {
            storage.removeItem(key)
            return
        }
        storage.setItem(key, state);
    }, [state])

    return [state, setState]
}

export function useSession(): [string | null, (s: string) => void, boolean, boolean, string | null] {
    const [sessionId, setSessionId] = useStorage("Semoxy_Session")
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        if (!sessionId) {
            setUserId(null)
            setLoggedIn(false)
            setLoading(false)
            return
        }
        getSessionInformation().then(i => {
            setUserId(i.userId)
            setLoggedIn(i.loggedIn)
            setLoading(false)
        });
    }, [sessionId])

    return [sessionId, setSessionId, isLoggedIn, loading, userId]
}
