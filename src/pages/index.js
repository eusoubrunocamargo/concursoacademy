import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {

  const [isLogin, setIsLogin] = useState(true);
  const handleLoginSignUp = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <main className={styles.mainContainer}>
        <section className={styles.loginSignUpContainer}>
          {isLogin ? 
          <>
          <span>Login</span>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <span>Ainda não é usuário? <button onClick={handleLoginSignUp}>Cadastre-se</button></span>
          </>
          :
          <>
          <span>Cadastre-se</span>
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <span>Já é usuário? <button onClick={handleLoginSignUp}>Faça login</button></span>
          </>}
        </section>
      </main>
    </>
  )
}
