import React, {useState} from "react";
import {createSession} from "../../services/session";
import {useAuth} from "../../ctx/auth";
import {useLoading} from "../../ctx/loading";
import Button from "../../components/button";
import Input, {PasswordInput} from "../../components/input";

import styles from "./login.module.css"
import FullScreenFormContainer from "../../components/form/fullscreen";
import FormBox, {BoxHeading, BoxText} from "../../components/form/box";
import {LoginScreenLogo} from "../../components/semoxy";
import {useAlert} from "../../alert/alertctx";

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const auth = useAuth()
    const loader = useLoading()
    const alert = useAlert()

    function login() {
        loader.requestIntent("Logging in", "LOG_IN")
        createSession(username, password)
            .then(l => {
                loader.finishIntent("LOG_IN")
                if (l.success) {
                    auth.setSessionId(l.sessionId)
                } else {
                    alert.alert({
                        type: "error",
                        message: "Invalid Credentials",
                        description: "Please check your username and password!"
                    })
                }
            })
    }

    return <FullScreenFormContainer>
        <FormBox>
            <LoginScreenLogo />
            <BoxHeading>Login</BoxHeading>
            <BoxText>
                You can only use Semoxy if an admin created an account for you!
                If you want to try out the interface, visit <a href={"https://test.semoxy.mc"}>test.semoxy.mc</a>!
            </BoxText>
            <Input
                type={"text"}
                onChange={e => setUsername(e.target.value)}
                placeholder={"Enter your Username"}
                label={"Username"}
                expand
            />
            <PasswordInput
                onChange={e => setPassword(e.target.value)}
                placeholder={"Enter your Password"}
                label={"Password"}
                expand
            />
            <div className={styles.buttons}>
                <Button type={"secondary"} cutoff>Forgot Password?</Button>
                <Button onClick={login} type={"primary"}>Login</Button>
            </div>
        </FormBox>
    </FullScreenFormContainer>
}
