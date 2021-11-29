import React, {useState} from "react";
import {createSession} from "../../services/session";
import {useAuth} from "../../ctx/auth";
import Button from "../../components/button";
import Input, {PasswordInput} from "../../components/input";

import FullSizeContainer from "../../components/form/full";
import FormBox, {StrongHeading, BoxText} from "../../components/form/box";
import {LoginScreenLogo} from "../../components/semoxy";
import {useAlert} from "../../ctx/alert/alertctx";
import {ButtonRow} from "../../components/interface/boxes/box";

export const LoginView: React.FC = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const auth = useAuth()
    const alert = useAlert()

    function login() {
        if (!username || !password) {
            alert.alert({
                type: "info",
                message: "No " + (username ? "Password" : "Username"),
                description: "Please enter your Credentials"
            })
            return
        }

        setLoading(true)
        createSession(username, password)
            .then(l => {
                setLoading(false)
                if (l.success) {
                    auth.setSessionId(l.sessionId)
                } else {
                    if (l.error === "root is disabled") {
                        alert.alert({
                            type: "info",
                            message: "Root is disabled",
                            description: "You can't login as the root user. This setting can be changed in the Semoxy configuration."
                        })
                    } else {
                        alert.alert({
                            type: "error",
                            message: "Invalid Credentials",
                            description: "Please check your username and password!"
                        })
                    }
                }
            })
    }

    return <FullSizeContainer>
        <FormBox onSubmit={login}>
            <LoginScreenLogo />
            <StrongHeading>Login</StrongHeading>
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
            <ButtonRow justify={"space-between"} style={{marginTop: "16px"}}>
                <Button type={"secondary"} cutoff>Forgot Password?</Button>
                <Button onClick={login} type={"primary"} loading={loading}>Login</Button>
            </ButtonRow>
        </FormBox>
    </FullSizeContainer>
}
