import React, {useContext, useState} from "react";
import {useMediaQuery} from "react-responsive";

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
    const [isDarkMode, setDarkMode] = useState(false)

    const isNavbarShown = (isMobile && navbarOpen) || !isMobile
    const contentShown = !(isMobile && navbarOpen) || !isMobile

    return <DesignContext.Provider value={{navbarOpen: isNavbarShown, setNavbarOpen, isDarkMode, setDarkMode, contentShown, isMobile}}>
        {children}
    </DesignContext.Provider>
}

export function useDesign() {
    return useContext(DesignContext)
}

export default DesignContext
