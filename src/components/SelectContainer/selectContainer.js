import styles from './selectContainer.module.css';
import SelectSubtopic from '../SelectSubtopic/selectSubtopic';
import { useState } from 'react';

export default function SelectContainer({ 
    setOpenFocus,
    setOpenDiagnosis, 
    setQuestions, 
    setOpenPerformance, 
    openPerformance,
    setOpenNotebook,
    openNotebook,
}) {

    const [openSelectSubtopic, setOpenSelectSubtopic] = useState(false);

    const selectOptions = [
        {
            name: 'Diagnóstico',
            action: () => setOpenSelectSubtopic(!openSelectSubtopic),
        },
        {
            name: 'Modo Foco',
            action: () => setOpenFocus(true),
        },
        {
            name: 'Meu rendimento',
            action: () => setOpenPerformance(!openPerformance),
        },
        {
            name: 'Meu caderno',
            action: () => setOpenNotebook(!openNotebook),
        },
    ]

    return (
        <div className={styles.selectContainer}>
            <div className={styles.selectContainer__buttons}>
            {selectOptions.map((option, index) => {
                return (
                    <button key={option.name} onClick={option.action} className={styles.selectContainer__option}>
                        <span>{option.name}</span>
                    </button>
                )
            })}  
            </div> 
            <div className={styles.selectContainer__selectSubtopicContainer}>
            {openSelectSubtopic && <SelectSubtopic setQuestions={setQuestions} setOpenDiagnosis={setOpenDiagnosis} setOpenSelectSubtopic={setOpenSelectSubtopic} />}         
            </div>
        </div>
    )
}