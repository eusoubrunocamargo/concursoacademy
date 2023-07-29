import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Menu from '@/../public/menu.svg';



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
        <div className={styles.logo}>
          <span>concurseiro//<span style={{ color: 'var(--main__pink)'}}>academy</span></span>
        </div>
        <div className={styles.greetingMenu}>
          <span>Olá, {user.user_metadata.username}!</span>
          <Image className={styles.menuSvg} src={Menu} alt="Menu" width={40} height={40} />
        </div>
      </header>
    </>
  );
}
