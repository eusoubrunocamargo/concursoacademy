import styles from './slotContainer.module.css'
import Clock from '../../../public/clock.svg'
import Fire from '../../../public/fire.svg'
import MenuWhite from '../../../public/menu_white.svg'
import Image from 'next/image';
import { calcDaysUntilReview } from '@/utils/calcDaysUntilReview'
import { DialogBox } from '@/utils/dialogBox'
import { useState } from 'react';
import { useDiagnosis } from '@/hooks/useDiagnosis'

export default function SlotContainer({ subtopic, days, setOpenDiagnosis }) {

    const { fetchQuestions } = useDiagnosis();
    const daysUntilReview = calcDaysUntilReview(subtopic.created_at, days);
    const [openDialogBox, setOpenDialogBox] = useState({
        open: false,
        text: '',
    });

    const handleDialogBox = (text, state) => {
        setOpenDialogBox({
            open: state,
            text: text,
        });
    }

    const [openSlotOptions, setOpenSlotOptions] = useState(false);
    const handleSlotOptions = () => {
        setOpenSlotOptions(!openSlotOptions);
    }

    const handleOpenNewDiagnosis = async () => {
        console.log(subtopic);
        const success = await fetchQuestions(subtopic.subtopic_id);
        if (!success) return;
        setOpenDiagnosis(true);
    }

    return (
        <div className={styles.slotContainer}>
            {openDialogBox.open && <DialogBox text={openDialogBox.text}/>}
            <div className={styles.slotContainer__title}>
                <Image onClick={handleSlotOptions} className={styles.slotContainer__btnMenu} src={MenuWhite} alt="Menu" width={20} height={20} style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    margin: '.5rem'
                }} />
                {openSlotOptions ? <>
                    <button onClick={handleOpenNewDiagnosis} style={{
                        gridRow: 2,
                    }} className={styles.slotOptions__menuButton}>Novo diagnóstico</button>
                    <button style={{
                        gridRow: 3,
                    }} className={styles.slotOptions__menuButton}>Excluir</button>
                </> : 
                <span className={styles.slotContainer__title__text}>{subtopic.subtopics.name}</span>}
            </div>
            <div className={styles.slotContainer__score}>
                <span>{subtopic.score}</span>
            </div>
            <div className={styles.slotContainer__daysUntilReview}>
                {daysUntilReview <= 0 ? 
                <Image 
                    onMouseEnter={() => handleDialogBox('O prazo para revisar acabou. Faça um novo diagnóstico ou exclua para liberar o slot!', true)} 
                    onMouseLeave={() => handleDialogBox('', false)} src={Fire} alt="Fire" width={20} height={20} 
                /> : <>
                <Image src={Clock} alt="Clock" width={20} height={20} />
                <span 
                    onMouseEnter={() => handleDialogBox('Este é o prazo para revisar a matéria. Após revisão, refaça o diagnóstico!', true)}
                    onMouseLeave={() => handleDialogBox('', false)}
                >{daysUntilReview} dias</span></>}
            </div>
        </div>
    )
}