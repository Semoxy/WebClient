import styles from "./header.module.css"
import React from "react";
import {HeaderLogo} from "../semoxy";
import {UserDropdown} from "./userdropdown";

export const Header: React.FC = () => {

    return <div className={styles.header}>
        <HeaderLogo />
        <div className={styles.end}>
            <UserDropdown />
        </div>
    </div>
}


