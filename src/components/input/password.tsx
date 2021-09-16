import React, {useEffect, useState} from "react";
import Input, {IInputProps} from "./index";
import styles from "./password.module.css"
import {PasswordIcon} from "../semoxy/icons";

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
            <PasswordIcon shown={passwordShown} onClick={() => setPasswordShown(!passwordShown)} className={styles.icon} />
        }
    />
}

export default PasswordInput