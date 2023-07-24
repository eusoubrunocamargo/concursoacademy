import styles from './studytime.module.css';
import { useStudySession } from '@/hooks/useStudySession';

export const StudyTime = () => {

    const { totalSeconds, loading } = useStudySession();

    function secondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        seconds = seconds % 60;
    
        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .join(":");
    }


    if(loading) {
        return <div>Carregando...</div>
    }

    return (
        <div className={styles.studyTimeContainer}>
            <div className={styles.studyTimeContainer__title}>
                <span>Tempo de estudo</span>
            </div>
            <div className={styles.studyTimeContainer__timer}>
                <span>Você já estudou um total de {secondsToTime(totalSeconds)} &#128170; </span>
            </div>
        </div>
    )
}