import React, {useContext, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {useStorage} from "../hooks";

interface IDesignContextProps {
    navbarOpen: boolean,
    setNavbarOpen(b: boolean): void,
    isDarkMode: boolean,
    setDarkMode(b: boolean): void,
    contentShown: boolean,
    isMobile: boolean
}

const DesignContext = React.createContext<IDesignContextProps>({
    navbarOpen: false,
    setNavbarOpen() {
    },
    isDarkMode: false,
    setDarkMode() {
    },
    contentShown: true,
    isMobile: false
})

export const DesignProvider: React.FC = ({children}) => {
    const isMobile = useMediaQuery({ query: "(max-width: 590px)" })
    const [navbarOpen, setNavbarOpen] = useState(false)
    const [_isDarkMode, _setDarkMode] = useStorage("Semoxy_Darkmode", localStorage, "false")
    const [isDarkMode, setDarkMode] = [_isDarkMode === "true", (b: boolean) => _setDarkMode(b + "")]

    const isNavbarShown = (isMobile && navbarOpen) || !isMobile
    const contentShown = !(isMobile && navbarOpen) || !isMobile

    return <DesignContext.Provider value={{navbarOpen: isNavbarShown, setNavbarOpen, isDarkMode, setDarkMode, contentShown, isMobile}}>
        <div className={isDarkMode ? "dark-mode" : "light-mode"}>
            {children}
        </div>
    </DesignContext.Provider>
}

export function useDesign() {
    return useContext(DesignContext)
}

export default DesignContext
