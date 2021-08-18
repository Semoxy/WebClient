import styles from "./header.module.css"
import React, {MouseEventHandler} from "react";
import {HeaderLogo} from "../semoxy";
import {UserDropdown} from "./userdropdown";
import {useDesign} from "../../ctx/design";


interface IBurgerMenuProps {
    onClick?: MouseEventHandler<HTMLInputElement>
}


export const BurgerMenu: React.FC<IBurgerMenuProps> = ({onClick}) => {
    return <label className={styles.burger}>
        <input type="checkbox" onClick={onClick} />
        <span />
        <span />
        <span />
    </label>
}


const ToggleNavbarButton: React.FC = () => {
    const design = useDesign()

    return <BurgerMenu onClick={(e) => design.setNavbarOpen(e.currentTarget.checked)} />
}


export const Header: React.FC = () => {
    const design = useDesign()

    return <div className={styles.header}>
        { design.isMobile ? <ToggleNavbarButton /> : <HeaderLogo /> }

        <div className={styles.end}>
            <UserDropdown />
        </div>
    </div>
}
