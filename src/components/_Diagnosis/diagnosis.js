import styles from './Diagnosis.module.css'
import { useEffect, useState } from 'react'
import { useDiagnosis } from '../../hooks/useDiagnosis';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';

export default function Diagnosis({ questions, setOpenDiagnosis }) {

    

    const { saveScore, saveQuestionsAnswers } = useDiagnosis();
    const { user } = useAuth();

    const [questionWithPerformance, setQuestionWithPerformance] = useState(
        questions.map((question) => ({
            ...question,
            performance: null,
            user_answer: null,
            is_answered: null,
            is_answered_correctly: null,
            resultMessage: null,
        }))
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questionWithPerformance[currentQuestionIndex];

    console.log(questionWithPerformance);
    
    const handleNavigation = (index) => {
        setCurrentQuestionIndex(index);
        setShowConfidence(false);
        setShowErrorType(false);
        setConfidenceLevel('');
    }

    const handlePerformance = () => {
        console.log(questionWithPerformance);
    }

    const calculatePerformance = (updatedState, currentQuestionIndex) => {
        let score = 0;
        console.log(updatedState[currentQuestionIndex]);
        if(updatedState[currentQuestionIndex].is_answered_correctly) 
        {
            console.log('acertou');
            if(confidenceLevel === '1') {
                score = 1;
            } else if(confidenceLevel === '2') {
                score = 0.8;
            } else if(confidenceLevel === '3') {
                score = 0;
            }
        } else {

            if(confidenceLevel === '1') {
                if(errorType === '1') {
                    score = -0.5;
                } else if(errorType === '2' || errorType === '3') {
                    score = 0.2;
                }
            } else if(confidenceLevel === '2') {
                if(errorType === '1') {
                    score = 0;  
                } else if(errorType === '2' || errorType === '3') {
                    score = 0.4;
                } 
            } else if(confidenceLevel === '3') {
                if(errorType === '1' || errorType === '2' || errorType === '3') {
                    score = 0;
                }
            }
        }
        console.log(score);

        setQuestionWithPerformance((prevState) => {
            const updatedQuestion = { ...prevState[currentQuestionIndex] };
            updatedQuestion.performance = score;
            const updatedState = [...prevState];
            updatedState[currentQuestionIndex] = updatedQuestion;
            return updatedState;
        });
    }

    const [showConfidence, setShowConfidence] = useState(false);
    const [showErrorType, setShowErrorType] = useState(false);
    const [confidenceLevel, setConfidenceLevel] = useState('');
    const [errorType, setErrorType] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [questionsAnswers, setQuestionsAnswers] = useState([]);
    
    const handleConfidenceLevel = (e) => {
        setConfidenceLevel(e.target.value);
    }

    const handleErrorType = (e) => {
        setErrorType(e.target.value);
    }

    const checkAnswer = (e) => {
        questionWithPerformance[currentQuestionIndex].user_answer = e.target.value;
        setSelectedAnswer(e.target.value);
        setShowConfidence(!showConfidence);
    }

    const submitAnswer = () => {
            
        if (questionWithPerformance[currentQuestionIndex].user_answer === currentQuestion.correct_answer) {
            setShowConfidence(false);
            setQuestionWithPerformance((prevState) => {
                const updatedQuestion = { ...prevState[currentQuestionIndex] };
                updatedQuestion.is_answered = true;
                updatedQuestion.is_answered_correctly = true;
                updatedQuestion.resultMessage = ' (Parabéns, você acertou!)';
                // showAlert('Parabéns, você acertou!', 'success');
                const updatedState = [...prevState];
                updatedState[currentQuestionIndex] = updatedQuestion;
                calculatePerformance(updatedState, currentQuestionIndex);
                return updatedState;
          });
        } else {
            setQuestionWithPerformance((prevState) => {
                const updatedQuestion = { ...prevState[currentQuestionIndex] };
                updatedQuestion.is_answered = true;
                updatedQuestion.is_answered_correctly = false;
                updatedQuestion.resultMessage = ' (Que pena, você errou!)';
                const updatedState = [...prevState];
                updatedState[currentQuestionIndex] = updatedQuestion;
                return updatedState;
            });
            setShowErrorType(true);
        }
    };

    const saveErrorType = () => {
        calculatePerformance(questionWithPerformance, currentQuestionIndex);
        setShowErrorType(false);
        setShowConfidence(false);
    }

    const showFinalScore = questionWithPerformance.every((q) => q.performance !== null);

    useEffect(() => {
        if(showFinalScore){
            let bruteScore = ((questionWithPerformance.reduce((acc, curr) => acc + curr.performance, 0)) / questionWithPerformance.length);
            if(bruteScore < 0) {
                bruteScore = 0;
            }
            setPerformance(Number(bruteScore*100).toFixed(2));

            setQuestionsAnswers(questionWithPerformance.map((question) => ({
                question_id: question.id,
                is_correct: question.is_answered_correctly,
                user_id: user.id,
            })));
        }
    }, [showFinalScore]);

    const handleSaveDiagnosis = () => {
        saveScore(questions[0].subtopic_id, performance);
        saveQuestionsAnswers(questionsAnswers);
        setOpenDiagnosis(false);
    }

    if (questions.length === 0 || !questions) return <h1>...</h1>

    return (

        <>
            <div className={styles.diagnosisContainer}>
                <main className={styles.mainDiagnosisContainer}>
                    <h1 onClick={handlePerformance}>Diagnóstico</h1>
                    {showFinalScore && <>
                        <span>Diagnóstico finalizado! Seu score é de {performance}%!</span>
                        <button className={styles.btnSaveDiagnosis} onClick={handleSaveDiagnosis}>Salvar diagnóstico</button>
                    </>}
                    <button className={styles.btnClose} onClick={() => setOpenDiagnosis(false)}>X</button>

                    <div className={styles.controller}>
                        {questionWithPerformance.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleNavigation(index)}
                                className={currentQuestionIndex === index ? styles.activeBtnController : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    
                    <section className={styles.containerQuestion}>
                        <span>{currentQuestion.question_text}</span>
                    </section>

                    <section className={styles.containerAnswers}>
                        {currentQuestion.is_multiple_choice === true ? (
                            <>  
                                <div className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        ${styles.containerOption}
                                        `}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='A'>
                                        {currentQuestion.option_a}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'A' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'A' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'B' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'B' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='B'>
                                        {currentQuestion.option_b}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'B' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'B' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'C' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'C' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='C'>
                                        {currentQuestion.option_c}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'C' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'C' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'D' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'D' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='D'>
                                        {currentQuestion.option_d}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'D' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'D' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'E' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'E' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='E'>
                                        {currentQuestion.option_e}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'E' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'E' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'A' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='A'>
                                        {currentQuestion.option_a}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'A' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'A' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                                <div className={styles.containerOption}>
                                    <button disabled={questionWithPerformance[currentQuestionIndex].is_answered} className={`${
                                        questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'B' &&
                                        questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isCorrect : ''}
                                        ${questionWithPerformance[currentQuestionIndex].is_answered &&
                                        questionWithPerformance[currentQuestionIndex].user_answer === 'B' &&
                                        !questionWithPerformance[currentQuestionIndex].is_answered_correctly ? styles.isIncorrect : ''}
                                        `} 
                                        onClick={(e) => checkAnswer(e)} value='B'>
                                        {currentQuestion.option_b}
                                        {questionWithPerformance[currentQuestionIndex].user_answer === 'B' && questionWithPerformance[currentQuestionIndex].resultMessage}
                                    </button>
                                    {showConfidence && selectedAnswer === 'B' && 
                                        <div className={styles.confidenceContainer}>
                                            <select onChange={handleConfidenceLevel} className={styles.selectConfidence}>
                                                <option value=''>Nível de confiança</option>
                                                <option value='1'>Tenho certeza</option>
                                                <option value='2'>Estou em dúvida</option>
                                                <option value='3'>Não sei</option>
                                            </select>
                                            {showErrorType ? <>
                                                <select onChange={handleErrorType} className={styles.selectErrorType}>
                                                    <option value=''>Tipo de erro</option>
                                                    <option value='1'>Não sei o conteúdo</option>
                                                    <option value='2'>Erro de interpretação</option>
                                                    <option value='3'>Erro de distração</option>
                                                </select>
                                                <button value='salvar' disabled={!errorType} onClick={saveErrorType} className={styles.btnConfirmConfidence}>Salvar</button>
                                                </> :
                                                <button value='confirmar' disabled={!confidenceLevel} onClick={submitAnswer} className={styles.btnConfirmConfidence}>Confirmar</button>    
                                                }
                                        </div>
                                    }
                                </div>
                            </>
                        )}
                    </section>
                </main>
            </div>
        </>
    )
}