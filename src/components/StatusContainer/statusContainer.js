import SlotContainer from '../SlotContainer/slotContainer';
import styles from './statusContainer.module.css'
import { useState } from 'react';

export default function StatusContainer({ children }) {

    const subtopics = Array.isArray(children.subtopics) ? children.subtopics : [];
    // console.log(subtopics);

    let backgroundColor = '';
    let title = '';
    let daysUntilReview = 0;

    if(children.status === 'approved') {
        backgroundColor = '#4BB543';
        title = 'Matérias aprovadas';
        daysUntilReview = 28;
    } else if(children.status === 'notApproved') {
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
                <div className={styles.statusContainer__header__slotLength}>{subtopics.length}/8</div>
            </div>
            {showSlotContainer && 
            <div className={styles.statusContainer__content}>
                {subtopics.map((subtopic, index) => {
                    return (
                        <SlotContainer setOpenDiagnosis={children.setOpenDiagnosis} key={index} children={subtopic} days={daysUntilReview}/>
                    )
                })}
            </div>}
        </div>
    )
}