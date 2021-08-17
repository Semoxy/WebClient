import React, {MouseEventHandler} from "react";
import styles from "./buttons.module.css";

export type ButtonType = "primary" | "secondary" | "danger" | "online" | "warning";

export interface IButtonProps {
    border?: boolean,
    onClick?: MouseEventHandler<HTMLButtonElement>,
    type: ButtonType,
    className?: string,
    cutoff?: boolean,
    disabled?: boolean,
    loading?: boolean
}

export const Button: React.FC<IButtonProps> = ({border, loading, cutoff, className, onClick, type, children, disabled}) => {
    let classNames = [styles.button]
    classNames.push(styles[type])
    border && classNames.push(styles.border)
    className && classNames.push(className)
    cutoff && classNames.push(styles.cutoff)

    return <button className={classNames.join(" ")} onClick={onClick} disabled={disabled || loading}>
        {loading ? <>Loading</> : children }
    </button>
}

export default Button
