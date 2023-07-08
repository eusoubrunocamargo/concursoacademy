import styles from './OptionContainer.module.css';
import { useState } from 'react';

export default function OptionContainer({ 
    option, 
    correctAnswer, 
    currentQuestionIndex,
    questionsPerformances, 
    setQuestionsPerformances }) {

    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [confidence, setConfidence] = useState(null);
    const [errorType, setErrorType] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleConfidence = (e) => {
        setConfidence(e.target.value);
    }

    const handleErrorType = (e) => {
        setErrorType(e.target.value);
    }


    const handleShowAnswer = () => {
        if (selectedAnswer) {
            setSelectedAnswer(null);
            setShowAnswer(false);
            return;
        }
        setSelectedAnswer(option.value);
        setShowAnswer(!showAnswer);
    }

    const handleAnswer = (e) => {
        if(e.target.innerText === 'Salvar') {
            handleSaveAnswer();
            setIsAnswered(true);
            return;
        }
        setIsCorrect(selectedAnswer === correctAnswer);
    }

    const handleSaveAnswer = () => {
        let score = 0;
        setIsAnswered(true);
        if(isCorrect) {
            if(confidence === '1') {
                score = 1;
            } else if(confidence === '2') {
                score = 0.8;
            } else if(confidence === '3') {
                score = 0;
            }
        } else {
            if(confidence === '1') {
                if(errorType === '1') {
                    score = -0.5;
                } else if(errorType === '2' || errorType === '3') {
                    score = 0.2;
                }
            } else if(confidence === '2') {
                if(errorType === '1') {
                    score = 0;  
                } else if(errorType === '2' || errorType === '3') {
                    score = 0.4;
                } 
            } else if(confidence === '3') {
                if(errorType === '1' || errorType === '2' || errorType === '3') {
                    score = 0.2;
                }
            }
        }
        const updatedQuestionsPerformances = [...questionsPerformances];
        updatedQuestionsPerformances[currentQuestionIndex][
            `question_${currentQuestionIndex}_performance`
        ] = score;
        setQuestionsPerformances(updatedQuestionsPerformances);
    }



    return (
        <section className={styles.containerAnswer}>
            <div onClick={handleShowAnswer} className={`${selectedAnswer && styles.activeAnswer} ${isCorrect === true ? styles.isCorrect : isCorrect === false ? styles.notCorrect : ''} ${selectedAnswer && styles.activeAnswer} ${styles.optionContainer}`}>
                <span>{option.text}</span>
                {isAnswered && <span>Você já respondeu esta questão!</span>}
            </div>
            {showAnswer && 
            <>
            <div className={styles.answerContainer}>
                <select onChange={handleConfidence} className={styles.confidenceSelect} name="answer" id="answer">
                    <option value="">Selecione o nível de confiança:</option>
                    <option value="1">Certeza</option>
                    <option value="2">Estou em dúvida</option>
                    <option value="3">Não sei</option>
                </select>
                {isCorrect === false ?
                <button disabled={!errorType} onClick={handleSaveAnswer} className={styles.btnAnswerQuestions}>Salvar</button>
                :
                <button disabled={!confidence} onClick={(e) => handleAnswer(e)} className={styles.btnAnswerQuestions}>{isCorrect ? 'Salvar' : 'Responder'}</button>
                }
                
                {isCorrect === false &&
                <select onChange={handleErrorType} className={styles.errorSelect} name="errortype" id="errortype">
                    <option value="">Selecione o tipo de erro:</option>
                    <option value="1">Falta de conteúdo</option>
                    <option value="2">Erro de interpretação</option>
                    <option value="3">Erro de distração</option>
                </select>}
            </div>
            </>}
        </section>
    )
}