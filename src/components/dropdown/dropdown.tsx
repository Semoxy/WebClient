import styles from "./dropdown.module.css"
import React, {Children, isValidElement, useState} from "react";

export interface IDropDownProps {
    currentItem: JSX.Element,
    onItemClick?(value: JSX.Element): void,
    tabIndex: number,
    className?: string
}

export const DropDown: React.FC<IDropDownProps> = ({currentItem, className, onItemClick, tabIndex, children}) => {
    const [collapsed, setCollapsed] = useState(true)

    const classNames = [styles.select]
    !collapsed && classNames.push(styles.open)
    className && classNames.push(className)

    const newChildren = Children.map(children, (child) => {
        if (isValidElement(child)) {
            return React.cloneElement(child, { onClick: () => onItemClick && onItemClick(child) })
        }
        return child
    })

    return <div tabIndex={tabIndex} className={classNames.join(" ")} onClick={() => setCollapsed(!collapsed)} onBlur={() => setCollapsed(true)}>
        {currentItem}
        <img className={styles["dropdown-arrow"]} src={"assets/arrow_down.svg"} alt={"Arrow Down"} />
        <div className={styles.dropdown}>
            {newChildren}
        </div>
    </div>
}
