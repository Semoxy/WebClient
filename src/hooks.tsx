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

export function useSession(): [string | null, (s: string) => void, boolean, boolean] {
    const [sessionId, setSessionId] = useStorage("Semoxy_Session")
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        if (!sessionId) {
            setLoggedIn(false)
            setLoading(false)
            return
        }
        getSessionInformation().then(i => {
            setLoggedIn(i.loggedIn)
            setLoading(false)
        });
    }, [sessionId])

    return [sessionId, setSessionId, isLoggedIn, loading]
}