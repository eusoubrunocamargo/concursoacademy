import Header from '@/components/Header/header'
import styles from '@/styles/Dashboard.module.css'
import Diagnosis from '@/components/Diagnosis/diagnosis'
import { useDiagnosis } from '@/hooks/useDiagnosis'
import { useScores } from '@/contexts/ScoreProvider'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Clock from '../../public/clock.svg'
import Happy from '../../public/happy.svg'

const DialogBox = ({
    setOpenDialogBox,
    text,
}) => {
    return (
        <div className={styles.dialogBox}>
            <Image src={Happy} alt='clock' width={30} height={30} />
            <span>{text}</span>
            {/* <button onClick={() => setOpenDialogBox(false)}>Fechar</button> */}
        </div>
    );
}

const SlotOptions = ({
    options,
    subtopic_id,
}) => {
    return (
        <div className={styles.containerSlotOptions}>
            {options.map((option) => (
                <button key={option.name} onClick={option.callback}>{option.name}</button>
            ))}
        </div>
    );
}

export default function Dashboard() {

    const { 
        subjects, 
        topics, 
        subtopics,
        questions, 
        loading,
        fetchTopics, 
        fetchSubtopics,
        fetchQuestions,
    } = useDiagnosis();

    const { scores } = useScores();

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');

    // const [openDialogBox, setOpenDialogBox] = useState(false);
    const [slotOptionsId, setSlotOptionsId] = useState(null);
    const [dialogBoxId, setDialogBoxId] = useState(null);
    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [approvedSubtopics, setApprovedSubtopics] = useState([]);
    const [notApprovedSubtopics, setNotApprovedSubtopics] = useState([]);
    const [attentionSubtopics, setAttentionSubtopics] = useState([]);

    const handleSlotOptions = (subtopic_id) => {
        if(slotOptionsId === subtopic_id) {
            setSlotOptionsId(null);
        } else {
        setSlotOptionsId(subtopic_id);
        }
        // console.log(slotOptionsId);
    }

    const handleSelectSubject = (e) => {
        setSelectedSubject(e.target.value);
        if (e.target.value === '') return;
        fetchTopics(Number(e.target.value));
    }

    const handleSelectTopic = (e) => {
        setSelectedTopic(e.target.value);
        if (e.target.value === '') return;
        fetchSubtopics(Number(e.target.value));
    }

    const handleSelectSubtopic = (e) => {
        if (e.target.value === '') {
            setSelectedSubtopic('');
            return;
        }
        setSelectedSubtopic(Number(e.target.value));
    }

    const generateQuestions = (subtopic_id) => {
        fetchQuestions(subtopic_id);
        setOpenDiagnosis(true);
        setSelectedSubject('');
        setSelectedTopic('');
        setSelectedSubtopic('');
    }

    useEffect(() => {
        const filterSubtopics = () => {
            const uniqueSubtopics = scores.reduce((unique, score) => {
                if (!unique.some(item => item.subtopic_id === score.subtopic_id)) {
                    unique.push(score);
                }
                return unique;
            }, []);            
            console.log(scores);
            console.log(uniqueSubtopics);

            const approvedSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score >= 70);
            const notApprovedSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score <= 60);
            const attentionSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score > 60 && subtopic.score < 70);

            setApprovedSubtopics(approvedSubtopics);
            setNotApprovedSubtopics(notApprovedSubtopics);
            setAttentionSubtopics(attentionSubtopics);
        }

        filterSubtopics();

    }, [scores])

    const calculateRemainingDaysUntilReview = (created_at, daysUntilReview) => {
        const createdDate = new Date(created_at);
        const reviewDate = new Date(createdDate.setDate(createdDate.getDate() + daysUntilReview));
        const currentDate = new Date();
        const remainingDays = Math.floor((reviewDate - currentDate) / (1000 * 60 * 60 * 24));
        return remainingDays;
    }

    if(loading) {
        return <div>Carregando...</div>
    }

    return (
        <>
            <main className={styles.mainDashContainer}>
                <Header />

                <section className={styles.selectSubtopic}>
                    
                    <select value={selectedSubject} onChange={(e) => handleSelectSubject(e)}>
                        <option value=''>Selecione a matéria</option>
                        {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                    </select>
                    
                    <select value={selectedTopic} disabled={selectedSubject === ''} onChange={(e) => handleSelectTopic(e)}>
                        <option value=''>Selecione o tópico</option>
                        {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                    </select>

                    <select value={selectedSubtopic} disabled={selectedTopic === ''} onChange={(e) => handleSelectSubtopic(e)}>
                        <option value=''>Selecione o sub-tópico</option>
                        {subtopics.map((subtopic) => <option key={subtopic.id} value={subtopic.id}>{subtopic.name}</option>)}
                    </select>

                    <button disabled={selectedSubtopic === ''} onClick={() => generateQuestions(selectedSubtopic)}>Diagnóstico</button>

                </section>

                {openDiagnosis && <Diagnosis questions={questions} setOpenDiagnosis={setOpenDiagnosis} />}

                <section className={styles.statusContainer}>
                    <div className={styles.notApprovedContainer}>
                        <div className={styles.containerHeader}>
                            <span onClick={() => console.log(notApprovedSubtopics)}>Matérias não aprovadas</span>
                        </div>
                        <div className={styles.containerSlots}>
                            {notApprovedSubtopics.length > 0 && notApprovedSubtopics.map((subtopic) =>
                             <div className={styles.eachSlot} key={subtopic.subtopic_id}>
                                {slotOptionsId === subtopic.subtopic_id ? <SlotOptions options={[
                                        {name: 'Novo diagnóstico', callback: () => generateQuestions(subtopic.subtopic_id)},
                                        {name: 'Fechar', callback: () => setSlotOptionsId(null)},
                                    ]}/> : <>
                                <span onClick={() => handleSlotOptions(subtopic.subtopic_id)} className={styles.slotTitle}>{subtopic.subtopics.name}</span>
                                <span className={styles.slotScore}>{subtopic.score}</span>
                                <div onMouseEnter={() => setDialogBoxId(subtopic.subtopic_id)} 
                                    onMouseLeave={() => setDialogBoxId(null)} 
                                    className={styles.slotDeadline}>
                                    {dialogBoxId === subtopic.subtopic_id && 
                                    <DialogBox text='Este é o prazo para revisar esta matéria. Após revisão, refaça o diagnóstico!' />}
                                    <Image src={Clock} alt='clock' width={20} height={20} />
                                    {calculateRemainingDaysUntilReview(subtopic.created_at, 7)} dias
                                </div></>}
                            </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.attentionContainer}>
                        <div className={styles.containerHeader}>
                            <span>Matérias em atenção</span>
                        </div>
                        <div className={styles.containerSlots}>
                            {attentionSubtopics.length > 0 && approvedSubtopics.map((subtopic) =>
                             <div className={styles.eachSlot} key={subtopic.subtopic_id}>
                                <span className={styles.slotTitle}>{subtopic.name}</span>
                                <span className={styles.slotScore}>{subtopic.score}</span>
                            </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.approvedContainer}>
                        <div className={styles.containerHeader}>
                            <span>Matérias aprovadas</span>
                        </div>
                        <div className={styles.containerSlots}>
                            {approvedSubtopics.length > 0 && approvedSubtopics.map((subtopic) =>
                             <div className={styles.eachSlot} key={subtopic.subtopic_id}>
                                <span className={styles.slotTitle}>{subtopic.subtopics.name}</span>
                                <span className={styles.slotScore}>{subtopic.score}</span>
                                <div onMouseEnter={() => setDialogBoxId(subtopic.subtopic_id)} onMouseLeave={() => setDialogBoxId(null)} className={styles.slotDeadline}>
                                    {dialogBoxId === subtopic.subtopic_id && 
                                    <DialogBox text='Este é o prazo para revisar esta matéria. Após revisão, refaça o diagnóstico!' />}
                                    <Image src={Clock} alt='clock' width={20} height={20} />
                                    {calculateRemainingDaysUntilReview(subtopic.created_at, 30)} dias
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
