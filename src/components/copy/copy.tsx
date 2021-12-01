import React, {useRef, MouseEvent} from "react"
import Input, {IInputProps} from "../input"
import {CopyIcon} from "../semoxy/icons"
import Button, {IButtonProps} from "../button"
import {IAlert, useAlert} from "../../ctx/alert/alertctx"


export interface ICopyButtonProps extends Partial<IButtonProps> {
    copyText: string,
    buttonText: string,
    alert?: IAlert
}


export const CopyButton: React.FC<ICopyButtonProps> = ({copyText, buttonText, alert, ...props}) => {
    const alertCtx = useAlert()

    function copy(e: MouseEvent<HTMLButtonElement>) {
        const element = document.createElement("textarea")

        element.value = copyText

        document.body.appendChild(element)
        // @ts-ignore
        element.select()
        document.execCommand("copy")
        document.body.removeChild(element)
        e.currentTarget.focus()

        if (alert) {
            alertCtx.alert(alert)
        }
    }


    return <Button onClick={copy} type={"primary"} {...props}>
        {buttonText}
    </Button>
}


export interface ICopyFieldProps extends Partial<IInputProps> {
    copyText: string,
    alert?: IAlert
}

export const CopyField: React.FC<ICopyFieldProps> = ({copyText, alert, ...props}) => {
    const fieldRef = useRef<HTMLInputElement | null>()
    const alertCtx = useAlert()

    function copy(e: MouseEvent<SVGSVGElement>) {
        fieldRef.current?.select()
        document.execCommand("copy")
        e.currentTarget.focus()

        if (alert) {
            alertCtx.alert(alert)
        }
    }

    return <Input ref={fieldRef} {...props} type={"text"} readonly icon={(document.queryCommandSupported("copy") && <CopyIcon onClick={copy} />) || undefined} value={copyText} />
}
