import React, {useContext, useEffect, useRef, useState} from "react";
import styles from "./alert.module.css"
import Alert from "./alert";

export type AlertType = "success" | "warning" | "error" | "info"

export interface IAlert {
    type: AlertType,
    message: string,
    description?: string,
    id?: number,
    timeout?: NodeJS.Timeout
}

export interface IAlertContextProps {
    alert(alert: IAlert): () => void
}

const AlertContext = React.createContext<IAlertContextProps>({
    alert: () => () => {}
})

export const AlertProvider: React.FC = ({children}) => {
    const [alertStack, setAlertStack] = useState<IAlert[]>([]);

    const alerts = useRef(alertStack)
    alerts.current = alertStack
    const idPointer = useRef(1)

    function closeAlert(id?: number) {
        const newAlerts = alerts.current.slice().filter((e) => e.id !== id)
        setAlertStack(newAlerts)
    }

    useEffect(() => {
        return () => alertStack.forEach((a) => a.timeout && clearTimeout(a.timeout))
    }, [])

    function alert(alert: IAlert): () => void {
        alert.id = idPointer.current++
        const newAlerts = alertStack.slice()
        newAlerts.push(alert)
        setAlertStack(newAlerts)
        alert.timeout = setTimeout(() => closeAlert(alert.id), 3000)
        return () => closeAlert(alert.id)
    }

    return <AlertContext.Provider value={{ alert }}>
        <div className={styles.container}>
            {alertStack.map((a) => {
                return <Alert
                    alert={a}
                    close={ () => closeAlert(a.id) }
                    key={a.id}
                />
            })}
        </div>
        {children}
    </AlertContext.Provider>
}

export function useAlert() {
    return useContext(AlertContext);
}

export default AlertContext
