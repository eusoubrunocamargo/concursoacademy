import style from './Diagnosis.module.css';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useAuth } from './../../hooks/useAuth';
import Image from 'next/image';
import Close from '@/../../public/white_close.svg';
import QuestionContainer from '../QuestionContainer/questionContainer';
import { useState } from 'react';
import { useQuestion } from '@/contexts/QuestionProvider';

export default function Diagnosis({ setOpenDiagnosis }) {

    const { loading, saveScore, saveQuestionsAnswers} = useDiagnosis();
    const { user } = useAuth();
    const { questions, setQuestions } = useQuestion();
    const [index, setIndex] = useState(0);

    const questionNavigate = (direction) => {
        if(direction === 'next') {
            if(index === questions.length - 1) {
                setIndex(0);
            } else {
                setIndex(index + 1);
            }
        } else if(direction === 'previous') {
            if(index === 0) {
                setIndex(questions.length - 1);
            } else {
                setIndex(index - 1);
            }
        }
    }

    const handleCloseDiagnosis = () => {
        setQuestions([]);
        setOpenDiagnosis(false);
    }

    const checkPerformance = questions.every((question) => question.performance !== null);

    const handleSubmitDiagnosis = () => {
        
        const questionsAnswers = (questions.map((question) => ({
            question_id: question.id,
            is_correct: question.is_answered_correctly,
            user_id: user.id,
        })));

        saveQuestionsAnswers(questionsAnswers);

        const percentage = (performance / questions.length) * 100;
        const { subject_id, topic_id, subtopic_id } = questions[0];
        saveScore(subject_id, topic_id, subtopic_id, percentage);
        // saveScore(questions[0].subtopic_id, percentage);
        setOpenDiagnosis(false);
    }

    const performance = questions.reduce((acc, question) => {
        return acc + question.performance;
    }, 0);

    if(loading) return <div>Carregando...</div>;

    return (
        <div className={style.diagnosisContainer}>
            <div className={style.diagnosisContainer__header}>
                <h1 onClick={() => console.log(questions)}>Diagnóstico</h1>
                <Image 
                    style={{ position: 'absolute', right: 0, marginRight: '1rem', cursor: 'pointer'}} 
                    src={Close} 
                    alt="Fechar diagnóstico" 
                    onClick={handleCloseDiagnosis} width={30} height={30} />
            </div>
            <div className={style.diagnosisContainer__questions}>
                <QuestionContainer 
                    questionNavigate={questionNavigate} 
                    index={index}/>
            </div>
            {checkPerformance && <div className={style.diagnosisContainer__finishDiagnosis}>
                <button onClick={handleSubmitDiagnosis}>Finalizar diagnóstico</button>
            </div>}
        </div>
    )
}