import React from "react"
import styles from "./box.module.css"
import {concatClasses} from "../../util"

interface IFormBoxProps {
    onSubmit?(): void,
    className?: string
}

const FormBox: React.FC<IFormBoxProps> = ({children, onSubmit, className}) => {
    return <div
        className={concatClasses(styles.container, className)}
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

const StrongHeading: React.FC = ({children}) => {
    return <h1 className={styles.heading}>
        {children}
    </h1>
}

const Spacing: React.FC = () => {
    return <div className={styles.spacer} />
}

export default FormBox
export { FormBox, StrongHeading, BoxText, Spacing }
