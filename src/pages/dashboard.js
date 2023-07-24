import styles from '@/styles/Dashboard.module.css'
import { useDiagnosis } from '@/hooks/useDiagnosis'
import { useScores } from '@/contexts/ScoreProvider'
import { useEffect, useState } from 'react'
import StatusContainer from '@/components/StatusContainer/statusContainer'
import SelectContainer from '@/components/SelectContainer/selectContainer'
import PerformanceContainer from '@/components/PerformanceContainer/performanceContainer'
import Diagnosis from '@/components/Diagnosis/diagnosis'
import FocusContainer from '@/components/FocusContainer/focusContainer'

export default function Dashboard() {

    const { loading } = useDiagnosis();
    const { scores } = useScores();
    const [approvedSubtopics, setApprovedSubtopics] = useState([]);
    const [notApprovedSubtopics, setNotApprovedSubtopics] = useState([]);
    const [attentionSubtopics, setAttentionSubtopics] = useState([]);
    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [openPerformance, setOpenPerformance] = useState(false);
    const [openFocus, setOpenFocus] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const filterSubtopics = () => {
            const uniqueSubtopics = scores.reduce((unique, score) => {
                if (!unique.some(item => item.subtopic_id === score.subtopic_id)) {
                    unique.push(score);
                }
                return unique;
            }, []);            

            const approvedSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score >= 70);
            const notApprovedSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score <= 60);
            const attentionSubtopics = uniqueSubtopics.filter((subtopic) => subtopic.score > 60 && subtopic.score < 70);

            setApprovedSubtopics(approvedSubtopics);
            setNotApprovedSubtopics(notApprovedSubtopics);
            setAttentionSubtopics(attentionSubtopics);
        }

        filterSubtopics();

    }, [scores])

    if(loading) {
        return <div>Carregando...</div>
    }

    return (
        <>
            {openFocus && <FocusContainer setOpenFocus={setOpenFocus} />}
            <main className={styles.mainDashContainer}>                
                <section className={styles.statusContainer}>
                    
                    {openDiagnosis ? <Diagnosis questions={questions} setOpenDiagnosis={setOpenDiagnosis} /> :
                    <>
                    <SelectContainer setOpenFocus={setOpenFocus} setQuestions={setQuestions} setOpenDiagnosis={setOpenDiagnosis} setOpenPerformance={setOpenPerformance} openPerformance={openPerformance} />
                    {openPerformance && <PerformanceContainer setOpenPerformance={setOpenPerformance} />}
                    <StatusContainer status='notApproved' subtopics={notApprovedSubtopics} setOpenDiagnosis={setOpenDiagnosis}/>
                    <StatusContainer status='attention' subtopics={attentionSubtopics} setOpenDiagnosis={setOpenDiagnosis}/>
                    <StatusContainer status='approved' subtopics={approvedSubtopics} setOpenDiagnosis={setOpenDiagnosis}/>
                    </>}
                </section>
            </main>
        </>
    )
}
