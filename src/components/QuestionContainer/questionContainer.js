import styles from './QuestionContainer.module.css';
import { useMemo, useState } from 'react';
import Analyzer from '../Analyzer/analyzer';
import RightArrow from '@/../../public/right.svg';
import LeftArrow from '@/../../public/left.svg';
import Image from 'next/image';
import { useQuestion } from '@/contexts/QuestionProvider';

export default function QuestionContainer({ 
    index, 
    questionNavigate,
}) {

    const { questions } = useQuestion();

    const options = useMemo(() => [
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "option_e"
    ], []);

    const [clickedOption, setClickedOption] = useState(null);
    const [openAnalyzer, setOpenAnalyzer] = useState(false);

    const handleClick = (option) => {
        if(clickedOption === option) {
            setClickedOption(null);
            setOpenAnalyzer(false);
            return;
        }
        setClickedOption(option);
        setOpenAnalyzer(true);
    }

    const stopPropagation = (e) => {
        e.stopPropagation();
    }


    const style = (option) => {
        const fixedStyle = styles.questionContainer__question__alternatives__item__text;
        if(clickedOption === option) {
            if(questions[index].is_answered_correctly === true) {
                return `${fixedStyle} ${styles.isCorrect}`;
            } else if(questions[index].is_answered_correctly === false) {
                return `${fixedStyle} ${styles.isWrong}`;
            } 
        }
        return fixedStyle;
    }

    const emoji = (option) => {
        if(clickedOption === option) {
            if(questions[index].is_answered_correctly === true) {
                return <p style={{margin:'0 1rem'}}>&#128079; {questions[index].resultMessage}</p>;
            } else if(questions[index].is_answered_correctly === false) {
                return <p style={{margin:'0 1rem'}}>&#128577; {questions[index].resultMessage}</p>;
            }
        }
    }

    const handleKeyDown = (e, option) => {
        if(e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleClick(option);
        }
    }

    // console.log(questions);

    return (
        <div className={styles.questionContainer}>
            <div className={styles.questionContainer__header}>
                <div className={styles.questionContainer__header__controllerContainer}>
                    <Image style={{cursor:'pointer'}} onClick={() => questionNavigate('previous')} src={LeftArrow} alt="Questão anterior" width={60} height={60} />
                        <h1>Questão {index + 1}</h1>
                    <Image style={{cursor:'pointer'}} onClick={() => questionNavigate('next')} src={RightArrow} alt="Próxima questão" width={60} height={60} />
                </div>
                <button className={styles.questionContainer__header__btnAddToNotebook}>Adicionar ao caderno</button>
            </div>
            <div className={styles.questionContainer__question}>
                <div className={styles.questionContainer__question__text}>
                    <p>{questions[index].question_text}</p>
                </div>
                <div className={styles.questionContainer__question__alternatives}>
                    {options.map((option) => {
                        if(questions[index][option]) {
                            return (
                                <div 
                                tabIndex={0}
                                role="button"
                                onKeyDown={(e) => handleKeyDown(e, option)}
                                disabled={questions[index].is_answered} 
                                onClick={questions[index].is_answered ? null : () => handleClick(option)} 
                                key={questions[index][option]} 
                                className={`${styles.questionContainer__question__alternatives__item}
                                ${questions[index].is_answered ? styles.disabled : ''}
                                `}
                                >
                                    <>
                                    <div className={style(option)}>
                                        {questions[index][option]}{emoji(option)}
                                    </div>                 

                                    <div onClick={stopPropagation}>                   
                                        {clickedOption === option 
                                            && openAnalyzer 
                                                && <>
                                                    <Analyzer 
                                                    setOpenAnalyzer={setOpenAnalyzer}
                                                    index={index}
                                                    option={option}
                                                    />
                                                    </>}
                                    </div>
                                    </>
                                </div>
                            )
                        }})}
                </div>
            </div>
        </div>
    )
}