import { useState } from 'react';
import styles from './Analyzer.module.css';
import { calculatePerformance } from '@/utils/calcPerformance';
import { useQuestion } from '@/contexts/QuestionProvider';


export default function Analyzer({
    setOpenAnalyzer,
    option,
    index,
}) {

    const { questions, setQuestions } = useQuestion();

    const checkAnswer = () => {
        const optionLetter = option.split("_")[1].toUpperCase();
        const copyQuestions = [...questions];
        copyQuestions[index].user_answer = optionLetter;
        copyQuestions[index].is_answered = true;
        copyQuestions[index].is_answered_correctly = copyQuestions[index].user_answer === copyQuestions[index].correct_answer;
        copyQuestions[index].resultMessage = copyQuestions[index].is_answered_correctly ? 'Parabéns, você acertou!' : 'Que pena, você errou!';
        setQuestions(copyQuestions);
        if(copyQuestions[index].is_answered_correctly === true) {
            calculatePerformance(confidenceLevel, errorType, index, questions, setQuestions);
            setOpenAnalyzer(false);
        }
    }

    const [confidenceLevel, setConfidenceLevel] = useState('0');
    const [errorType, setErrorType] = useState('0');

    const handleConfidenceLevel = (e) => {
        setConfidenceLevel(e.target.value);
    }

    const handleErrorType = (e) => {
        setErrorType(e.target.value);
    }

    const savePerformance = () => {
        calculatePerformance(confidenceLevel, errorType, index, questions, setQuestions);
        setOpenAnalyzer(false);
    }

    return (
        <div className={styles.analyzerContainer}>
            <select onChange={handleConfidenceLevel} className={styles.analyzerContainer__confidenceContainer} name="confidence" id="confidence">
                <option value="0">Selecione seu nível de confiança</option>
                <option value="1">Tenho certeza</option>
                <option value="2">Estou em dúvida</option>
                <option value="3">Não tenho a menor ideia</option>
            </select>
            {questions[index].is_answered_correctly === false && 
                <select onChange={handleErrorType} className={styles.analyzerContainer__errorTypeContainer} name="error" id="error">
                    <option value="0">Selecione o tipo de erro</option>
                    <option value="1">Não sei o conteúdo</option>
                    <option value="2">Erro de interpretação</option>
                    <option value="3">Erro de distração</option>
                </select>}
            {questions[index].is_answered_correctly === false ?
                <button disabled={errorType === '0' || confidenceLevel === '0'} className={styles.analyzerContainer__btnAnswer} onClick={savePerformance}>Salvar</button> :
                <button disabled={confidenceLevel === '0'} className={styles.analyzerContainer__btnAnswer} onClick={checkAnswer}>Responder</button>}
        </div>
    )
}