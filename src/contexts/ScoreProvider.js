import { createContext, useState, useContext, useMemo } from "react";

const ScoresContext = createContext();

export const useScores = () => useContext(ScoresContext);


export const ScoresProvider = ({ children }) => {

    const [scores, setScores] = useState([]);

    const value = useMemo(() => ({ scores, setScores }), [scores, setScores]);

    return (
        <ScoresContext.Provider value={value}>
            {children}
        </ScoresContext.Provider>
    )
}