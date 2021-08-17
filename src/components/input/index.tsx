import React, {ChangeEventHandler} from "react";
import styles from "./inputs.module.css"
import {useUniqueId} from "../../hooks";
import PasswordInput from "./password";

export type InputType = "text" | "password"

export interface IInputProps {
    placeholder?: string,
    type: InputType,
    icon?: JSX.Element,
    label?: string,
    value?: string,
    readonly?: boolean,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    defaultValue?: string,
    expand?: boolean,
    autoComplete?: string,
    ref?: any
}

const Input: React.FC<IInputProps> = React.forwardRef<HTMLInputElement, IInputProps>(({placeholder, expand, type, defaultValue, icon, label, value, readonly, onChange, autoComplete}, ref) => {
    const id = useUniqueId("input");

    const fieldClasses = [styles.field]
    expand && fieldClasses.push(styles.expand)

    if (icon) {
        // add icon class to icon element
        icon = React.cloneElement(icon, {
            className: icon.props.className ? `${icon.props.className} ${styles.icon}` : styles.icon
        })
    }

    return <div className={styles.input}>
        {label && <label className={styles.label} htmlFor={id}>{label}</label> }
        <input
            id={id}
            placeholder={placeholder}
            type={type}
            value={value}
            defaultValue={defaultValue}
            readOnly={readonly}
            onChange={onChange}
            className={fieldClasses.join(" ")}
            autoComplete={autoComplete}
            ref={ref}
        />
        { icon && icon }
    </div>
})

export default Input
export { Input, PasswordInput }
