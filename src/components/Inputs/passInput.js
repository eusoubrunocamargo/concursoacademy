import styles from './FormInput.module.css';
import { useState } from 'react';

function PassInput({ signUpForm , setSignUpForm }){

    const [passVisible, setPassVisible] = useState(false);
    function togglePassVisibility(){
        setPassVisible(!passVisible);
    };
    const [showPassModal, setShowPassModal] = useState(false);


    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);

    const passRequirements = [
            {id: 'uppercase', regex: /[A-Z]/, valid: false},
            {id: 'lowercase', regex: /[a-z]/, valid: false},
            {id: 'number', regex: /[0-9]/, valid: false},
            {id: 'specialChar', regex: /[!@#$%^&*]/, valid: false},
            {id: 'minLengthPass', test: (value) => value.length >=6, valid: false},
    ];

    function handleFocus(event){
        event.target.value = '';
        setHasError(false);
        setShowPassModal(true);
        setSignUpForm({
            ...signUpForm,
            password: {
                value: '',
                valid: false,
            },
        });
    }
   
    function handleChange(event){

        const newPassValue = event.target.value;

        
        passRequirements.forEach((requirement) => {
            const element = document.getElementById(requirement.id);
            const isValid = requirement.regex
            ? requirement.regex.test(newPassValue)
            : requirement.test(newPassValue);
            requirement.valid = isValid;
            if(element)element.classList.toggle(`${styles.greenPass}`, isValid);
        });


        const allReqMet = passRequirements.every((req) => req.valid);

        setHasError(!allReqMet);
        setErrorMessage(allReqMet?'':'Esta senha não é válida');
      
        setSignUpForm(prev => ({
            ...prev,
            password: {
                value: newPassValue,
                valid: allReqMet,
            }
        }))
    };

    function handleBlur(){
        setShowPassModal(false);
    };

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputNameAndError}>
                <label htmlFor="password">senha</label>
                {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
            <div style={{
                position:'relative',
            }}>
                <input
                    type={passVisible?'text':'password'}
                    id='password'
                    name='password'
                    placeholder='********'
                    className={`${hasError&&styles.invalidInput}`}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <button className={styles.btnRevealPass} onClick={togglePassVisibility}>{passVisible ? 'Ocultar' : 'Mostrar'}</button>
            </div>
            {showPassModal &&
                    <aside className={styles.passModal}>
                        <span>Sua senha deve conter:</span>
                        <span id='uppercase'>Maiúscula</span>
                        <span id='lowercase'>Minúscula</span>
                        <span id='number'>Número</span>
                        <span id='specialChar'>Caracter[!@#$%^&*]</span>
                        <span id='minLengthPass'>Mínimo 6 caracteres</span>
                    </aside>}
        </div>
    )
}

export default PassInput;