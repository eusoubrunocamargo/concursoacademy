import styles from './Timer.module.css';
import { useState, useEffect } from 'react';
import { useStudySession } from '@/hooks/useStudySession';
import Image from 'next/image';
import Close from '../../../public/white_close.svg';
export default function Timer({ selectedOption, setOpenFocus}) {

    const { saveStudySession } = useStudySession();

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [openSaveSession, setOpenSaveSession] = useState(false);
    
    const handleStart = () => {
        setIsActive(true);
    }

    const handlePause = () => {
        setIsActive(false);
    }

    const handleReset = () => {
        if(seconds === 0) return;
        setIsActive(false);
        setOpenSaveSession(true);
    }

    const handleSaveSession = async () => {
        const success = await saveStudySession(selectedOption.subject, selectedOption.topic, seconds);
        if(success) {
            setSeconds(0);
            setOpenSaveSession(false);
            setOpenFocus(false);
        }
    }

    const handleDontSaveSession = () => {
        setSeconds(0);
        setOpenSaveSession(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);

    }, [isActive, seconds]);

    return (
        <div className={styles.timerFullContainer}>
            <button onClick={() => setOpenFocus(false)} className={styles.timerFullContainer__closeButton}>
                <Image src={Close} alt="Fechar" width={40} height={40} />
            </button>
            <div className={styles.timerContainer}>
                <div className={styles.timerContainer__greeting}>
                    <span>Você está estudando {selectedOption.subject_name}, {selectedOption.topic_name}</span>
                </div>
                <div className={styles.timerContainer__panel}>                
                    <div className={styles.timerContainer__panel__formatNumbers}>
                        <div>{('0' + Math.floor((seconds / 3600))).slice(-2)}</div>
                        <div>:</div>
                        <div>{('0' + Math.floor((seconds / 60) % 60)).slice(-2)}</div>
                        <div>:</div>
                        <div>{('0' + (seconds % 60)).slice(-2)}</div>
                    </div>
                    <div className={styles.timerContainer__panel__timerButtons}>
                        <button disabled={openSaveSession} onClick={handleStart}>Iniciar</button>
                        <button disabled={openSaveSession} onClick={handlePause}>Pausar</button>
                        <button disabled={openSaveSession} onClick={handleReset}>Encerrar</button>
                    </div>
                    {openSaveSession && 
                    <div className={styles.timerContainer__panel__saveSession}>
                        <span>Deseja salvar a sessão?</span>
                        <div className={styles.timerContainer__panel__saveSession__btnContainer}>
                            <button onClick={handleSaveSession}>Sim</button>
                            <button onClick={handleDontSaveSession}>Não</button>
                            <button onClick={() => setOpenSaveSession(false)}>Fechar</button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}