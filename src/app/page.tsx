'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useAppContext } from '@/app-context';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .post(ServerRoutes.login, { email: username, password })
      .then((response) => {
        localStorage.setItem('accessToken', response?.data?.accessToken);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
        localStorage.setItem('date', new Date().getTime().toString());
        router.push('product');
      })
      .catch((error) => {
        alert(error.response?.data?.message);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>The Advertisers Admin Portal</h1>
      <div className={styles.loginContainer}>
        <h1 className={styles.heading}>Welcome</h1>
        <form onSubmit={(event) => handleLogin(event)}>
          <input
            className={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
