import React, {useContext, useEffect, useState} from "react"
import {useAuth} from "./auth"
import {getUserInformation, UserInformation} from "../services/session"
import {useLoading} from "./loading/loading"

interface IUserContextProps {
    user: UserInformation,
    userId: string | null
}

const UserContext = React.createContext<IUserContextProps>({
    user: {
        username: "<unknown>",
        root: false,
    },
    userId: "<unknown>"
})

export const UserProvider: React.FC = ({children}) => {
    const [user, setUser] = useState<UserInformation>({
        username: "<unknown>",
        root: false
    })
    const [fetched, setFetched] = useState(false)

    const auth = useAuth()
    const loading = useLoading()

    useEffect(() => {
        loading.requestIntent("Loading User Information", "LOAD_USER_INFO")
        getUserInformation().then(i => {
            setUser(i)
            loading.finishIntent("LOAD_USER_INFO")
            setFetched(true)
        })
    }, [])

    return <UserContext.Provider value={{
        user,
        userId: auth.userId
    }}>
        {fetched && children}
    </UserContext.Provider>
}

export function useUser() {
    return useContext(UserContext)
}

export default UserContext
