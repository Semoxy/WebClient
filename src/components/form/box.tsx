import React from "react";
import styles from "./box.module.css"

interface IFormBoxProps {
    onSubmit?(): void
}

const FormBox: React.FC<IFormBoxProps> = ({children, onSubmit}) => {
    return <div
        className={styles.container}
        onKeyDown={(e) => e.key === "Enter" && onSubmit && onSubmit()}
    >
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
