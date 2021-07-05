import React, {useContext, useEffect} from "react";
import {useSession} from "../hooks";
import {useHistory} from "react-router";
import * as stream from "stream";


interface AuthContextProps {
    isLoggedIn: boolean,
    sessionId: string | null,
    setSessionId(s: string | null): void,
    userId: string | null,
}

const AuthContext = React.createContext<AuthContextProps>({
    isLoggedIn: false,
    sessionId: null,
    setSessionId(s: string | null) {},
    userId: null,
})

export const AuthProvider: React.FC = ({children}) => {
    const [sessionId, setSessionId, isLoggedIn, sessionLoading, userId] = useSession()
    const history = useHistory()

    useEffect(() => {
        history.replace(isLoggedIn ? "/" : "/login")
    }, [isLoggedIn])

    return <AuthContext.Provider value={{
        sessionId,
        setSessionId,
        isLoggedIn,
        userId
    }}>
        {sessionLoading || children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}

export default AuthContext
