import React, {useState} from "react";
import {createSession} from "./services/session";
import {useAuth} from "./ctx/auth";
import {useLoading} from "./ctx/loading";

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const auth = useAuth()
    const loader = useLoading()

    function login() {
        loader.requestIntent("Logging in", "LOG_IN")
        createSession(username, password)
            .then(l => {
                loader.finishIntent("LOG_IN")
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
