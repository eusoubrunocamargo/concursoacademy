import EmailInput from '@/components/Inputs/emailInput';
import NameInput from '@/components/Inputs/nameInput';
import PassInput from '@/components/Inputs/passInput';
import styles from '@/styles/Home.module.css';
import { useState } from 'react';
import { supabase } from '../../supabase';
import { useRouter } from 'next/router';

const RenderSection = ({ 
  showConfirmEmail, 
  isLogin, 
  signUpForm, 
  setSignUpForm, 
  handleLoginSignUp, 
  submitSignUpForm,
  submitSignInForm,
}) => {

  if (showConfirmEmail) {
    return <span>Confirme seu email</span>
  }

  if (isLogin) {
    return (
      <>
        <span>Login</span>
        <EmailInput signUpForm={signUpForm} setSignUpForm={setSignUpForm}/>
        <PassInput signUpForm={signUpForm} setSignUpForm={setSignUpForm}/>
        <button onClick={submitSignInForm}>Entrar</button>
        <span>Ainda não é usuário? <button onClick={handleLoginSignUp}>Cadastre-se</button></span>
      </>
    );
  }

  return (
    <>
      <span>Cadastre-se</span>
      <NameInput signUpForm={signUpForm} setSignUpForm={setSignUpForm} />
      <EmailInput signUpForm={signUpForm} setSignUpForm={setSignUpForm} type='signup'/>
      <PassInput signUpForm={signUpForm} setSignUpForm={setSignUpForm} />
      <button onClick={submitSignUpForm}>Cadastrar</button>
      <span>Já é usuário? <button onClick={handleLoginSignUp}>Faça login</button></span>
    </>
  );
};

export default function Home() {

  const [isLogin, setIsLogin] = useState(true);
  const [showConfirmEmail, setShowConfirmEmail] = useState(false);
  const router = useRouter();

  const handleLoginSignUp = () => {
    setIsLogin(!isLogin);
  };

  const [signUpForm, setSignUpForm] = useState({
    username: {
      value: '',
      valid: false
    },
    email: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: false
    }
  });

  const submitSignUpForm = async () => {
    // e.preventDefault();
    console.log(signUpForm);
    const isFormValid = Object.values(signUpForm).every(({ valid }) => valid === true);
    console.log(isFormValid);
    if(isFormValid){
      const { data, error } = await supabase.auth.signUp({
        email: signUpForm.email.value,
        password: signUpForm.password.value,
        options: {
          data: {
            username: signUpForm.username.value,
          }
        }
      });

      if(error){
        console.log(error);
      } else {
        console.log(data);
        setShowConfirmEmail(true);
    }};
  };

  const submitSignInForm = async () => {
    const isFormValid = [signUpForm.email.valid, signUpForm.password.valid].every(valid => valid === true);
    if(isFormValid){
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: signUpForm.email.value,
          password: signUpForm.password.value,
        })
      });

      const data = await res.json();
      console.log(data);
      console.log(res.ok);
      if(res.ok){
        router.push('/dashboard');
      } else {
        console.log(data.error);
      }
    }
};

  return (
    <>
      <main className={styles.mainContainer}>
        <section className={styles.loginSignUpContainer}>
        <RenderSection
          showConfirmEmail={showConfirmEmail}
          isLogin={isLogin}
          signUpForm={signUpForm}
          setSignUpForm={setSignUpForm}
          handleLoginSignUp={handleLoginSignUp}
          submitSignUpForm={submitSignUpForm}
          submitSignInForm={submitSignInForm}
        />
        </section>
      </main>
    </>
  )
}
