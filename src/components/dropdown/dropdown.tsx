import styles from "./dropdown.module.css"
import React, {useState} from "react";

export interface IDropDownProps {
    currentItem: JSX.Element,
    tabIndex: number,
    className?: string,
    dropdownClassName?: string
}

export const DropDown: React.FC<IDropDownProps> = ({currentItem, dropdownClassName, className, tabIndex, children}) => {
    const [collapsed, setCollapsed] = useState(true)

    const classNames = [styles.select]
    !collapsed && classNames.push(styles.open)
    className && classNames.push(className)

    const dropdownClassNames = [styles.dropdown]
    dropdownClassName && dropdownClassNames.push(dropdownClassName)

    return <div tabIndex={tabIndex} className={classNames.join(" ")} onClick={() => setCollapsed(!collapsed)} onBlur={() => setCollapsed(true)}>
        {currentItem}
        <img className={styles["dropdown-arrow"]} src={"assets/arrow_down.svg"} alt={"Arrow Down"} />
        <div className={dropdownClassNames.join(" ")}>
            {children}
        </div>
    </div>
}
