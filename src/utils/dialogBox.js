import Image from 'next/image';
import Happy from '../../public/happy.svg';

export const DialogBox = ({ text }) => {

    const styles = {
        dialogBox: {
            position: 'absolute',
            fontSize: 'small',
            zIndex: 100,
            right: '-32rem',
            backgroundColor: '#F8F9FA',
            color: '#333',
            border: 'solid 1px #333',
            borderRadius: '.5rem',
            width: '30rem',
            height: '8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            gap: '1rem',
        }
    }

    return (
        <div style={styles.dialogBox} className={styles.dialogBox}>
            <Image src={Happy} alt='dialog_box' width={30} height={30} />
            <span>{text}</span>
        </div>
    );
}

