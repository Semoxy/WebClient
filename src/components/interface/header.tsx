import styles from "./header.module.css"
import React from "react";
import {HeaderLogo} from "../semoxy";
import {DropDown} from "../dropdown/dropdown";
import {useUser} from "../../ctx/user";
import {deleteSession} from "../../services/session";
import {useAuth} from "../../ctx/auth";

export const Header: React.FC = () => {
    const user = useUser()

    return <div className={styles.header}>
        <HeaderLogo />
        <div className={styles.end}>
            <DropDown currentItem={<div>{user.username}</div>} tabIndex={1} className={styles["user-menu"]} dropdownClassName={styles.dropdown}>
                <LogoutButton />
            </DropDown>
        </div>
    </div>
}


const LogoutButton: React.FC = () => {
    const auth = useAuth()

    function logout() {
        console.log("click")
        deleteSession().then(i => i && auth.setSessionId(null))
    }

    return <div className={styles.logout} onClick={logout}>
        Logout
    </div>
}
