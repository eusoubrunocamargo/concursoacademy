import SlotContainer from '../SlotContainer/slotContainer';
import styles from './statusContainer.module.css'
import { useState } from 'react';

export default function StatusContainer({ subtopics, status, setOpenDiagnosis }) {

    const mysubtopics = Array.isArray(subtopics) ? subtopics : [];
    // console.log(subtopics);

    let backgroundColor = '';
    let title = '';
    let daysUntilReview = 0;

    if(status === 'approved') {
        backgroundColor = '#4BB543';
        title = 'Matérias aprovadas';
        daysUntilReview = 28;
    } else if(status === 'notApproved') {
        backgroundColor = '#d26666';
        title = 'Matérias não aprovadas';
        daysUntilReview = 7;
    } else {
        backgroundColor = '#FFA629';
        title = 'Matérias em atenção';
        daysUntilReview = 14;
    }

    const [showSlotContainer, setShowSlotContainer] = useState(false);

    return (
        <div className={styles.statusContainer}>
            <div onClick={() => setShowSlotContainer(!showSlotContainer)} style={{
                backgroundColor: backgroundColor,
            }} className={styles.statusContainer__header}>
                <span>{title}</span>
                <div className={styles.statusContainer__header__slotLength}>{mysubtopics.length}/8</div>
            </div>
            {showSlotContainer && 
            <div className={styles.statusContainer__content}>
                {mysubtopics.map((subtopic, index) => {
                    return (
                        <SlotContainer setOpenDiagnosis={setOpenDiagnosis} key={index} subtopic={subtopic} days={daysUntilReview}/>
                    )
                })}
            </div>}
        </div>
    )
}