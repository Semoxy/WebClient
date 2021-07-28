import React, {useContext, useEffect, useState} from "react";
import {useSession} from "../hooks";
import {useHistory} from "react-router";


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

    useEffect(() => {
        if (sessionLoading) return

        // when not logged in
        if (!isLoggedIn && !history.location.pathname.startsWith("/login")) {
            setUrlAfterLogin(history.location.pathname)
            history.replace("/login")
            return
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
