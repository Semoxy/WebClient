import {UIEventHandler, useEffect, useState} from "react";
import {useStorageJSON} from "../../hooks";


export function useScrollBottom(offset: number): [boolean, UIEventHandler<HTMLDivElement>] {
    const [isAtBottom, setAtBottom] = useState(false)

    const onScroll: UIEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight - offset) {
            setAtBottom(true)
        } else if (isAtBottom) {
            setAtBottom(false)
        }
    }

    return [isAtBottom, onScroll]
}


export function useCommandHistory(): [string | null, () => void, () => void, () => void, (_: string) => void] {
    const [command, setCommand] = useState<string | null>("")
    const [currentCommand, setCurrentCommand] = useState<string | null>("")
    const [cmdHistory, setCmdHistory] = useStorageJSON<string[]>("Semoxy_CommandHistory", localStorage, [])
    const [historyIndex, setHistoryIndex] = useState<number>(-1)

    function commandSent() {
        if (!command) {
            return
        }

        let newHistory = cmdHistory.slice()
        if (command === cmdHistory[historyIndex]) {
            newHistory = newHistory.filter(s => s !== command)
        }
        newHistory.unshift(command)
        setCmdHistory(newHistory)
        setHistoryIndex(-1)
        setCommand(null)
    }

    function up() {
        if (historyIndex === -1) {
            setCurrentCommand(command)
        }

        const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1)
        setHistoryIndex(newIndex)
        console.log(newIndex)
    }

    function down() {
        const newIndex = Math.max(historyIndex - 1, -1)
        setHistoryIndex(newIndex)
        console.log(newIndex)
    }

    useEffect(() => {
        if (historyIndex < 0) {
            setCommand(currentCommand)
        } else {
            setCommand(cmdHistory[historyIndex] || command)
        }
    }, [historyIndex])

    return [command, commandSent, up, down, setCommand]
}
