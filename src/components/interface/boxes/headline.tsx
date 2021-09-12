import React from "react";
import styles from "./headline.module.css"


export const LightHeading: React.FC = ({children}) => {
    return <h3 className={styles.headline}>{children}</h3>
}
