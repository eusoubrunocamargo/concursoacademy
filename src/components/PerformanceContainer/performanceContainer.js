import styles from './PerformanceContainer.module.css';
import { useDiagnosis } from '@/hooks/useDiagnosis';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Rendimento'
        }
    },
};



export default function PerformanceContainer() {

    const { fullScores, loading } = useDiagnosis();
    console.log(fullScores);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    // const [subtopics, setSubtopics] = useState([]);
    const [selectSubject, setSelectSubject] = useState('0');
    const [selectTopic, setSelectTopic] = useState('0');
    const [selectSubtopic, setSelectSubtopic] = useState('0');

    const handleSelect = (e) => {
        switch(e.target.name) {
            case 'subject':
                setSelectSubject(e.target.value);
                filterTopics(Number(e.target.value));
                break;
            case 'topic':
                setSelectTopic(e.target.value);
                break;
            case 'subtopic':
                setSelectSubtopic(e.target.value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
            const uniqueSubjects = fullScores.reduce((prev, curr) => {
                if(!prev.some((item) => item.subject_id === curr.subject_id)) {
                    prev.push({
                        subject_id: curr.subject_id,
                        subject_name: curr.subjects.name,
                    });
                }
                return prev;
            }, []);
            setSubjects(uniqueSubjects);

            const uniqueTopics = fullScores.reduce((prev, curr) => {
                if(!prev.some((item) => item.topic_id === curr.topic_id)) {
                    prev.push({
                        topic_id: curr.topic_id,
                        topic_name: curr.topics.name,
                    });
                }
                return prev;
            }, []);
            setTopics(uniqueTopics);
    }, [fullScores])

    const filterTopics = (subject_id) => {
        const filteredTopics = fullScores.reduce((prev, curr) => {
            if(curr.subject_id === subject_id) {
                if(!prev.some((item) => item.topic_id === curr.topic_id)) {
                    prev.push({
                        topic_id: curr.topic_id,
                        topic_name: curr.topics.name,
                    });
                }
            }
            return prev;
        }, []);
        setTopics(filteredTopics);
    }

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Evolução'
            }
        },
    };

    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [title, setTitle] = useState('');
    const [showChart, setShowChart] = useState(false);

    const generateGraph = (subject_id) => {
        const filteredScores = fullScores.filter((score) => score.subject_id === subject_id);
        console.log(filteredScores);
        let sum = 0;
        const uniqueData = filteredScores.reduce((prev, curr) => {
            sum += curr.score;
            if(!prev.some((item) => item.created_at === curr.created_at)) {
                return [...prev, { name: curr.subjects.name , data: curr.created_at, avg: sum / (prev.length + 1) }];
            }
            return prev;
        }, []);
        console.log(uniqueData);
        const labels = uniqueData.map((data) => data.data);
        const data = uniqueData.map((data) => data.avg);
        setLabels(labels);
        setData(data);
        setTitle(uniqueData[0].name);
        setShowChart(true);
    }

    return (
        <div className={styles.performanceContainer}>
            {loading ? <div>Carregando...</div> : <>

            <div className={styles.performanceContainer__header}>
                <h1>Rendimento</h1>
                <span>Você pode escolher matéria, tópico ou subtópico específico. Para ver seu rendimento geral em uma matéria, deixe os campos tópico/subtópico em branco.</span>
            </div>

            <div className={styles.performanceContainer__selectContainer}>
                <select name='subject' id='subject' onChange={(e) => handleSelect(e)}>
                    <option value='0'>Selecione a matéria</option>
                    {subjects.map((subject) => {
                        return <option key={subject.subject_id} value={subject.subject_id}>{subject.subject_name}</option>
                    })}
                </select>


                <select disabled={selectSubject === '0'} name='topic' id='topic' onChange={(e) => handleSelect(e)}>
                    <option value='0'>Selecione o tópico</option>
                    {topics.map((topic) => {
                        return <option key={topic.topic_id} value={topic.topic_id}>{topic.topic_name}</option>
                    })}
                </select>


                <select disabled={selectTopic === '0'} name='subtopic' id='subtopic'>
                    <option value=''>Selecione o subtópico</option>
                </select>


                {/* <button onClick={() => console.log(subjects)}>Exibir</button> */}
                <button onClick={() => generateGraph(Number(selectSubject))}>Exibir</button>
            </div></>}
            {showChart && 
            <div className={styles.performanceContainer__graphContainer}>
                <Line data={{
                    labels: labels,
                    datasets: [{
                        label: `${title}`,
                        data: data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }],
                }} options={options} />
            </div>}
        </div>
    )
}