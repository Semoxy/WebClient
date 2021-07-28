import React, {useContext, useEffect, useState} from "react";
import {useAuth} from "./auth";
import {getUserInformation} from "../services/session";
import {useLoading} from "./loading/loading";

interface IUserContextProps {
    username: string,
    userId: string | null,
    permissions: string[]
}

const UserContext = React.createContext<IUserContextProps>({
    username: "<unknown>",
    userId: "<unknown>",
    permissions: []
})

export const UserProvider: React.FC = ({children}) => {
    const [username, setUsername] = useState<string>("")
    const [permissions, setPermissions] = useState<string[]>([])
    const [fetched, setFetched] = useState(false)

    const auth = useAuth()
    const loading = useLoading()

    useEffect(() => {
        loading.requestIntent("Loading User Information", "LOAD_USER_INFO")
        getUserInformation().then(i => {
            setUsername(i.username)
            setPermissions(i.permissions)
            loading.finishIntent("LOAD_USER_INFO")
            setFetched(true)
        })
    }, [])

    return <UserContext.Provider value={{
        username,
        userId: auth.userId,
        permissions
    }}>
        {fetched && children}
    </UserContext.Provider>
}

export function useUser() {
    return useContext(UserContext)
}

export default UserContext
