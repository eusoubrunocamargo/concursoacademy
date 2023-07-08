import { createContext, useState, useContext } from "react";

const ScoresContext = createContext();

export const useScores = () => useContext(ScoresContext);


export const ScoresProvider = ({ children }) => {

    const [scores, setScores] = useState([]);

    return (
        <ScoresContext.Provider value={{ scores, setScores }}>
            {children}
        </ScoresContext.Provider>
    )
}