import { createContext, useState, useContext, useMemo } from "react";

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);


export const PerformanceProvider = ({ children }) => {

    const [performance, setPerformance] = useState([]);

    const value = useMemo(() => ({ performance, setPerformance }), [performance, setPerformance]);

    return (
        <PerformanceContext.Provider value={value}>
            {children}
        </PerformanceContext.Provider>
    )
}