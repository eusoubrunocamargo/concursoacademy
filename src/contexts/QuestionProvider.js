import { createContext, useState, useContext, useMemo } from "react";

const QuestionContext = createContext();

export const useQuestion = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {

    const [questions, setQuestions] = useState([]);

    const value = useMemo(() => ({ questions, setQuestions }), [questions, setQuestions]);

    return (
        <QuestionContext.Provider value={value}>
            {children}
        </QuestionContext.Provider>
    )
}