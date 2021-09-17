import React, {MouseEventHandler} from "react";
import styles from "./buttons.module.css";
import loadingStyles from "./loading.module.css"
import {concatClasses} from "../../util";

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
    return <button className={concatClasses(
        styles.button,
        styles[type],
        border && styles.border,
        className && className,
        cutoff && styles.cutoff
    )} onClick={onClick} disabled={disabled || loading}>
        {loading ? <ButtonLoadingAnimation /> : children }
    </button>
}

export const ButtonLoadingAnimation: React.FC = () => {
    return <div className={loadingStyles.ring}>
        <div />
        <div />
        <div />
        <div />
    </div>
}

export default Button
