import styles from "./createRootUser.module.css"
import React, {useRef, useState} from "react";
import FullSizeContainer from "../../components/form/full";
import FormBox, {BoxHeading, BoxText} from "../../components/form/box";
import {LoginScreenLogo} from "../../components/semoxy";
import Input from "../../components/input";
import Button from "../../components/button";
import {useHistory} from "react-router";
import {createRootUser} from "../../services/rootUserCreation";
import {useAlert} from "../../ctx/alert/alertctx";


export const CreateRootUserView: React.FC = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [secret, setSecret] = useState("")
    const secretElement = useRef<HTMLInputElement>()
    const [loading, setLoading] = useState(false)

    const history = useHistory()
    const alert = useAlert()

    function onSubmit() {
        if (!username || !password) {
            alert.alert({
                type: "info",
                message: "No " + (username ? "Password" : "Username"),
                description: `Please enter the ${username ? "Password" : "Username"} for the new account`
            })
            return
        }
        if (!secret) {
            alert.alert({
                type: "info",
                message: "No Access Secret Provided",
                description: "Please enter the 48 character access secret that you can find in the \"root.txt\" inside your server root directory"
            })
            return;
        }

        setLoading(true)
        createRootUser(username, password, secret).then(result => {
            setLoading(false)
            if (result.success) {
                alert.alert({
                    type: "success",
                    message: "Root User Created",
                    description: "You can now login using the set credentials"
                })
                history.replace("/login")
                return
            }
            let errorMessage, errorDescription

            switch (result.error) {
                case "Already existing": {
                    errorMessage = "Root User already existing"
                    errorDescription = "Redirecting you to the login page"
                    history.push("/login")
                    break;
                }
                case "Wrong Token": {
                    errorMessage = "Wrong Secret"
                    errorDescription = "The provided access secret was wrong and has been reset"
                    if (secretElement.current) {
                        secretElement.current.value = ""
                    }
                    break
                }
                default: {
                    errorMessage = "Unknown Error"
                    errorDescription = "Please try again"
                }
            }

            alert.alert({
                type: "error",
                message: errorMessage,
                description: errorDescription
            })
        })


    }

    return <FullSizeContainer>
        <FormBox onSubmit={onSubmit}>
            <LoginScreenLogo />
            <BoxHeading>Create Root Account</BoxHeading>
            <BoxText>
                You’re about to create the first account in this Semoxy-Instance! Exciting!
            </BoxText>
            <Input type={"text"}
                   placeholder={"Enter Username"}
                   label={"Username"}
                   onChange={(e) => setUsername(e.target.value)}
                   expand
            />
            <Input type={"password"}
                   placeholder={"Enter a new Password"}
                   label={"Password"}
                   onChange={(e) => setPassword(e.target.value)}
                   expand
                   autoComplete={"new-password"}
            />
            <Input type={"password"}
                   placeholder={"Paste Access Secret"}
                   label={"Access Secret"}
                   onChange={(e) => setSecret(e.target.value)}
                   expand
                   autoComplete={"off"}
                   ref={secretElement}
            />
            <div className={styles["button-wrap"]}>
                <Button type={"primary"} onClick={onSubmit} disabled={loading}>Create Account</Button>
            </div>
        </FormBox>
    </FullSizeContainer>
}
