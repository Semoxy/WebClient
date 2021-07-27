import React, {useEffect, useState} from "react";
import Input, {IInputProps} from "./index";
import styles from "./password.module.css"

const PasswordInput: React.FC<Partial<IInputProps>> = (props) => {
    const [passwordShown, setPasswordShown] = useState(false)

    useEffect(() => {
        if (!passwordShown) return
        setTimeout(() => setPasswordShown(false), 2000)
    }, [passwordShown])

    return <Input
        {...props}
        type={passwordShown ? "text" : "password"}
        icon={
            <img
                src={passwordShown ? "./assets/password_hidden.svg" : "./assets/password_shown.svg"}
                alt={passwordShown ? "Hide Password" : "Show Password"}
                onClick={() => setPasswordShown(!passwordShown)}
                className={styles.icon}
            />
        }
    />
}

export default PasswordInput