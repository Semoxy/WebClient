import styles from "./dropdown.module.css"
import React, {useState} from "react";
import {concatClasses} from "../../util";
import {InputLabel} from "../input";
import {useUniqueId} from "../../hooks";
import {DropdownArrow} from "../semoxy/icons";

export interface IDropDownProps {
    currentItem: JSX.Element,
    tabIndex: number,
    className?: string,
    dropdownClassName?: string,
    imageClassName?: string,
    expand?: boolean,
    label?: string,
    notOpenableWhenOneChild?: boolean
}

export const DropDown: React.FC<IDropDownProps> = ({currentItem, dropdownClassName, className, tabIndex, children, imageClassName, expand, label, notOpenableWhenOneChild}) => {
    const [collapsed, setCollapsed] = useState(true)
    const id = useUniqueId("dropdown")

    const childCount = React.Children.toArray(children).filter(c => React.isValidElement(c)).length
    const hasChildren = !!childCount

    return <div>
        { label && <InputLabel htmlFor={id}>{label}</InputLabel> }
        <div id={id} tabIndex={tabIndex} className={concatClasses(styles.select, !collapsed && styles.open, className, expand && styles.expand)} onClick={() => setCollapsed(!collapsed)} onBlur={() => setCollapsed(true)}>
            { currentItem }
            { hasChildren && !(childCount <= 0 && notOpenableWhenOneChild) ? <>
                <DropdownArrow className={concatClasses(styles["dropdown-arrow"], imageClassName)} />
                { !collapsed && <div className={concatClasses(styles.dropdown, dropdownClassName)}>
                    {children}
                </div> }
            </> : <></>}
        </div>
    </div>
}

interface IDefaultDropDownItemProps {
    onClick?(): void
}

export const DefaultDropDownItem: React.FC<IDefaultDropDownItemProps> = ({children, onClick}) => {
    return <div className={styles.item} onClick={onClick}>
        {children}
    </div>
}
