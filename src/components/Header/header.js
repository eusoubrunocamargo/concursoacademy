import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css'
import { useState, useEffect } from 'react';


export default function Header() {
  
  const { user, handleSignOut } = useAuth();

  if (!user || !user.user_metadata.username) {
    return (
      <>
        <span>Carregando...</span>
      </>
    );
  }

  return (
    <>
      <header className={styles.headerContainer}>
        <span>Olá, {user.user_metadata.username}!</span>
        <button onClick={handleSignOut}>Sair</button>
      </header>
    </>
  );
}
