import styles from "./header.module.css"
import React from "react";
import {HeaderLogo} from "../semoxy";

export const Header: React.FC = () => {
    return <div className={styles.header}>
        <HeaderLogo />
    </div>
}
