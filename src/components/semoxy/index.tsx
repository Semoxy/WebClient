import React from "react"
import styles from "./semoxy.module.css"

export const LoginScreenLogo: React.FC = () => {
    return <img src={"assets/semoxy.png"} alt={"Semoxy Logo"} className={styles["login-logo"]}/>
}


export const HeaderLogo: React.FC = () => {
    return <img src={"assets/semoxy.png"} alt={"Semoxy Logo"} className={styles["header-logo"]}/>
}
