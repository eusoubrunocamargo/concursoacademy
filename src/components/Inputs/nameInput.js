import styles from './FormInput.module.css';
import { useState } from 'react';

function NameInput({ signUpForm , setSignUpForm }){

    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);

    function handleBlur(){
        const username = signUpForm.username.value.trim();
        if(username.length < 3 && username.length !== 0){
            setErrorMessage('Mínimo 3 caracteres');
            setHasError(true);
            setSignUpForm({
                ...signUpForm,
                username: {
                    value: username,
                    valid: false,
                }
            });
        } else {
            setHasError(false);
            setSignUpForm({
                ...signUpForm,
                username: {
                    value: username,
                    valid: true,
                }
            });
        }
    };

    function handleChange(event){
        const newUsernameValue = event.target.value;
        setSignUpForm(prev => ({
            ...prev,
            username: {
                value: newUsernameValue,
                valid: prev.username.valid,
            }
        }))
    };

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputNameAndError}>
            <label htmlFor="name">username</label>
            {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
            <input
                type='text'
                id='name'
                name='name'
                placeholder='brunocamargo'
                className={`${hasError&&styles.invalidInput}`}
                onBlur={handleBlur}
                onChange={handleChange}
                required
            />
        </div>
    )
}

export default NameInput;