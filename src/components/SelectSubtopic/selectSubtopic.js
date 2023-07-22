import styles from './selectSubtopic.module.css';
import { useDiagnosis } from '@/hooks/useDiagnosis'
import { useState } from 'react';
import { useRouter } from 'next/router';


export default function SelectSubtopic({ setOpenDiagnosis, _setQuestions }) {

    const { 
        subjects, 
        topics, 
        subtopics,
        fetchTopics, 
        fetchSubtopics,
        fetchQuestions,
    } = useDiagnosis();

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedSubtopic, setSelectedSubtopic] = useState('');


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

    const generateQuestions = async (subtopic_id) => {
        const success = await fetchQuestions(subtopic_id);
        if (!success) return;
        setOpenDiagnosis(true);
        setSelectedSubject('');
        setSelectedTopic('');
        setSelectedSubtopic('');
    }

    return (
        
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
        
    )
}