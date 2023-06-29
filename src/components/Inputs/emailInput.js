import styles from '@/styles/FormInput.module.css'
import { useState } from 'react';

function EmailInput({ signUpForm , setSignUpForm, type }){

    const [errorMessage, setErrorMessage] = useState('');
    const [hasError, setHasError] = useState(false);

    async function checkEmailExists(email){
        const { data , error } = await supabase.from('profiles').select().eq('email', email);
        if(error){
            console.log('Erro checando email: ', error.message);
            return false;
        }
        return data.length > 0;
    }

    async function handleBlur(){

        const email = signUpForm.email.value;

        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if(!email){
            setHasError(false);
            setErrorMessage('');
            setSignUpForm({
                ...signUpForm,
                email: {
                    // value: email,
                    valid: false,
                },
            });
            return;
        }; 
        
        if(!emailRegex.test(email)){
            setErrorMessage('Este e-mail não é válido');
            setHasError(true);
            setSignUpForm({
                ...signUpForm,
                email: {
                    // value: email,
                    valid: false,
                }
            });
            return;
        } 
          
            
    };

    function handleFocus (e){
        e.target.value = '';
        setHasError(false);
        setSignUpForm({
            ...signUpForm,
            email: {
                value: '',
                valid: false,
            },
        });
    }
    

    function handleChange(event){
        // console.log('entrou no handleChange');
        const newEmailValue = event.target.value;
        setSignUpForm(prev => ({
            ...prev,
            email: {
                value: newEmailValue,
                valid: true,
            }
        }))
    };

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputNameAndError}>
                <label htmlFor="email">email</label>
                {hasError && <span className={styles.errorMessage}>{errorMessage}</span>}
            </div>
            <input
                type='email'
                id='email'
                name='email'
                placeholder='bruno@email.com'
                className={`${hasError&&styles.invalidInput}`}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                // required
            />
        </div>
    )
}

export default EmailInput;