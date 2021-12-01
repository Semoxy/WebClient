import styles from "./pages.module.css"
import React from "react"


export const Headline: React.FC = ({children}) => {
    return <h2 className={styles.headline}>
        {children}
    </h2>
}
