
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { adminClaims } from "/roles.js";
import firebase from '../lib/firebase.js'
import Router from 'next/router.js';
import styles from '../styles/Login.module.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            // authenticated user at this point
            console.log(user)

            // route to authenticated using next router

            const idTokenResult = await auth.currentUser.getIdTokenResult(true);
            const { claims } = idTokenResult;

            if (claims.admin) {
                console.log('Admin user');
                Router.push('/admin/dashboard')
            }

            if(claims.technician) {
                Router.push('/technician/dashboard')
            }

        } catch (error) {
            // user sign on failed
            console.error(error);
        }
    }

    return (
        <div className={styles.container}>
            <form className={styles.login} onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input className={styles.emailInput} type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input className={styles.passwordInput} type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </label>
                <br />
                <button className={styles.loginbtn} type="submit">Sign in</button>
            </form>
        </div>
    );
};

export default Login;
