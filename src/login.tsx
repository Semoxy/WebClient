import React, {useState} from "react";
import {createSession} from "./services/session";
import {useAuth} from "./ctx/auth";

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const auth = useAuth()

    function login() {
        createSession(username, password)
            .then(l => {
                if (l.success) {
                    auth.setSessionId(l.sessionId)
                }
            })
    }

    return <>
        <input type={"text"} onChange={e => setUsername(e.target.value)}/>
        <input type={"password"} onChange={e => setPassword(e.target.value)}/>
        <button onClick={login}>Login</button>
    </>
}
