import styles from './FocusContainer.module.css';
import Image from 'next/image';
import Close from '@/../../public/white_close.svg';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useState } from 'react';
import Timer from '../Timer/timer';

export default function FocusContainer({ setOpenFocus }) {

    const { 
        subjects, 
        topics, 
        subtopics,
        fetchTopics, 
        fetchSubtopics,
    } = useDiagnosis();

    const [selectedOption, setSelectedOption] = useState({
        subject: '0',
        subject_name: '',
        topic: '0',
        topic_name: '',
    });

    const handleSelect = (e) => {
        switch(e.target.name) {
            case 'subject':
                console.log(e.target.options[e.target.selectedIndex].text);
                setSelectedOption({
                    ...selectedOption,
                    subject: e.target.value,
                    subject_name: e.target.options[e.target.selectedIndex].text,
                    topic: '0',
                    topic_name: '',
                });
                fetchTopics(Number(e.target.value));
                break;
            case 'topic':
                setSelectedOption({
                    ...selectedOption,
                    topic: e.target.value,
                    topic_name: e.target.options[e.target.selectedIndex].text,
                    subtopic: '0',
                });
                fetchSubtopics(Number(e.target.value));
                break;
            default:
                break;
        }
    };

    const [showTimer, setShowTimer] = useState(false);
    const handleStartTimer = () => {
        setShowTimer(true);
    }

    return (
        <div className={styles.focusContainer}>
            {!showTimer ? 
            <>
            <button onClick={() => setOpenFocus(false)} className={styles.focusContainer__closeButton}>
                <Image src={Close} alt="Fechar" width={40} height={40} />
            </button>
            <div className={styles.focusContainer__title}>
                <span>FOCO</span>
                <span>O que você vai estudar?</span>
            </div>
            <div className={styles.focusContainer__select}>
                <select className={styles.focusContainer__select__select} onChange={(e) => handleSelect(e)} name="subject" id="subject">
                    <option value="0">Selecione a matéria</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
                <select disabled={selectedOption.subject === '0'} className={styles.focusContainer__select__select} onChange={(e) => handleSelect(e)} name="topic" id="topic">
                    <option value="0">Selecione o tópico</option>
                    {topics.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                </select>
                <button onClick={handleStartTimer} disabled={selectedOption.subject === '0' || selectedOption.topic === '0'} className={styles.focusContainer__select__button}>Estudar</button>
            </div>
            </> :
            <>
            <Timer setOpenFocus={setOpenFocus} selectedOption={selectedOption} />
            </>}
        </div>
    )
}