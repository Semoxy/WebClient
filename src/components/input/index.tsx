import React, {ChangeEventHandler} from "react";
import styles from "./inputs.module.css"
import {useUniqueId} from "../../hooks";
import PasswordInput from "./password";
import {concatClasses} from "../../util";

interface IInputLabelProps {
    htmlFor?: string
}

export const InputLabel: React.FC<IInputLabelProps> = ({children, htmlFor}) => {
    return <label className={styles.label} htmlFor={htmlFor}>{children}</label>
}

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
        {label && <InputLabel htmlFor={id}>{label}</InputLabel> }
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

export interface ITextAreaProps {
    placeholder?: string,
    label?: string,
    value?: string,
    defaultValue?: string,
    readonly?: boolean,
    onChange?: ChangeEventHandler<HTMLTextAreaElement>,
    expand?: boolean,
    autoComplete?: string,
    ref?: any,
    wrapClassName?: string,
    className?: string,
    fill?: boolean
}

export const TextArea: React.FC<ITextAreaProps> = React.forwardRef<HTMLTextAreaElement, ITextAreaProps>(({
    label,
    placeholder,
    value,
    defaultValue,
    readonly,
    onChange,
    expand,
    wrapClassName,
    className,
    fill,
    autoComplete}, ref) => {
    const id = useUniqueId("textarea");

    const fieldClasses = [styles.field, styles.textarea]

    expand && fieldClasses.push(styles.expand)
    className && fieldClasses.push(className)

    return <div className={concatClasses(styles.input, styles["textarea-wrap"], wrapClassName, fill && styles.fill)}>
        { label && <InputLabel htmlFor={id}>{label}</InputLabel> }
        <textarea
            ref={ref}
            id={id}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            readOnly={readonly}
            onChange={onChange}
            autoComplete={autoComplete}
            className={fieldClasses.join(" ")}
        />
    </div>
})

export default Input
export { Input, PasswordInput }
