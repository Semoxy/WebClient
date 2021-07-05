import React, {useContext, useEffect} from "react";
import {useSession} from "../hooks";
import {useHistory} from "react-router";


interface AuthContextProps {
    isLoggedIn: boolean,
    sessionId: string | null,
    setSessionId(s: string | null): void
}

const AuthContext = React.createContext<AuthContextProps>({
    isLoggedIn: false,
    sessionId: null,
    setSessionId(s: string | null) {},
})

export const AuthProvider: React.FC = ({children}) => {
    const [sessionId, setSessionId, isLoggedIn, sessionLoading] = useSession()
    const history = useHistory()

    useEffect(() => {
        history.push(isLoggedIn ? "/" : "/login")
    }, [isLoggedIn])

    return <AuthContext.Provider value={{
        sessionId,
        setSessionId,
        isLoggedIn
    }}>
        {sessionLoading || children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

export default AuthContext
