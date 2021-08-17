import React, {useContext, useEffect, useState} from "react";
import {useSession} from "../hooks";
import {useHistory} from "react-router";
import {useSemoxyStatus} from "./status";


interface AuthContextProps {
    isLoggedIn: boolean,
    sessionId: string | null,
    setSessionId(s: string | null): void,
    userId: string | null,
    sessionLoading: boolean
}

const AuthContext = React.createContext<AuthContextProps>({
    isLoggedIn: false,
    sessionId: null,
    setSessionId() {},
    userId: null,
    sessionLoading: true
})

export const AuthProvider: React.FC = ({children}) => {
    const [sessionId, setSessionId, isLoggedIn, sessionLoading, userId] = useSession()
    const [urlAfterLogin, setUrlAfterLogin] = useState<string | null>(null)
    const history = useHistory()
    const status = useSemoxyStatus()

    useEffect(() => {
        if (sessionLoading) return

        // when not logged in
        if (!isLoggedIn && !history.location.pathname.startsWith("/login")) {
            // don't redirect when no account exists
            if (!status.status.hasRoot) return;

            setUrlAfterLogin(history.location.pathname)
            history.replace("/login")
            return
        }

        if (history.location.pathname.startsWith("/login") && isLoggedIn) {
            history.replace("/")
        }

        if (urlAfterLogin !== null) {
            // redirect to url that was requested before redirect to login page
            history.push(urlAfterLogin)
        }
    }, [isLoggedIn, sessionLoading])

    return <AuthContext.Provider value={{
        sessionId,
        setSessionId,
        isLoggedIn,
        userId,
        sessionLoading
    }}>
        {sessionLoading || children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

export default AuthContext
