import styles from './NotebookContainer.module.css';

export const NotebookContainer = ({ setOpenNotebook }) => {



    return (
        <div className={styles.notebookContainer}>
            <div className={styles.notebookContainer__header}>
                <div className={styles.notebookContainer__header__title}>
                    <span>Meu Caderno</span>
                </div>
                <div className={styles.notebookContainer__header__selectContainer}>
                    <select id='subject' name='subject'>
                        <option value=''>Selecione uma matéria</option>
                    </select>
                    <select id='topic' name='topic'>
                        <option value=''>Selecione um tópico</option>
                    </select>
                    <select id='subtopic' name='subtopic'>
                        <option value=''>Selecione um subtópico</option>
                    </select>
                    <button>Filtrar</button>
                </div>
            </div>

            <div className={styles.notebookContainer__questionTableHeader}>
                <span>Questão</span>
                <span>Matéria</span>
                <span>Tópico</span>
                <span>Subtópico</span>
                <span>Excluir</span>
            </div>

        </div>
    )
}