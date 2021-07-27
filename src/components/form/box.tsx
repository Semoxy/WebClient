import React from "react";
import styles from "./box.module.css"

const FormBox: React.FC = ({children}) => {
    return <div className={styles.container}>
        {children}
    </div>
}

const BoxText: React.FC = ({children}) => {
    return <div className={styles.text}>
        {children}
    </div>
}

const BoxHeading: React.FC = ({children}) => {
    return <h1 className={styles.heading}>
        {children}
    </h1>
}

const Spacing: React.FC = () => {
    return <div className={styles.spacer} />
}

export default FormBox
export { FormBox, BoxHeading, BoxText, Spacing }
