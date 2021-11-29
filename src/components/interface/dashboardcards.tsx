import styles from "./dashboardcards.module.css"
import React from "react";


interface IOverviewItemProps {
    title: string,
    value: string,
    icon: JSX.Element
}


export const OverviewItem: React.FC<IOverviewItemProps> = ({icon, value, title}) => {
    return <div className={styles.item}>
        <div className={styles.icon}>
            {icon}
        </div>
        <div className={styles.text}>
            <h5>{title}</h5>
            <p>{value}</p>
        </div>
    </div>
}


export const OverviewItemList: React.FC = ({children}) => {
    return <div className={styles["icon-area"]}>
        {children}
    </div>
}
