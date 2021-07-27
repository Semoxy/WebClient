import React from "react";
import styles from "./semoxy.module.css"

const LoginScreenLogo: React.FC = () => {
    return <img src={"assets/semoxy.png"} alt={"Semoxy Logo"} className={styles.logo}/>
}

export { LoginScreenLogo }
