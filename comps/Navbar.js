import {getAuth} from 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react';
import firebase, {auth} from '../lib/firebase.js'
import jsonwebtoken from 'jsonwebtoken'
import Router from 'next/router.js';
import Link from 'next/link.js';
import styles from '../styles/Home.module.css'
import { connectFirestoreEmulator } from 'firebase/firestore';
import { useJsApiLoader } from '@react-google-maps/api';


const Navbar = () => {

  const { googleLoaded, error } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ['places']
});

const [apiLoaded, setApiLoaded] = useState(false);

useEffect(() => {
    if (googleLoaded && !error) {
        setApiLoaded(true);
    }
}, [googleLoaded, error]);

  const handleLogout = async (e) => {
   
    auth.signOut()
    Router.push('/login')

  }

  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  if(!user) {
    return (
    <nav className={styles.Navbar}>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>

    </nav>
    )
  }

  const decodedAt = jsonwebtoken.decode(user.accessToken);

  return (
    <nav className={styles.Navbar}>
      <Link href="/">Home</Link>

      {!user ? (
        <Link href="/login">Login</Link>
      ) : (
        <>
              {decodedAt.technician ? (
            <Link href="/technician/dashboard">Dashboard</Link>
          ) : (
            <Link href="/admin/dashboard">Dashboard</Link>
          )}
          <div>Welcome, {user.email}</div>
          <button className={styles.logout} onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  )
}

export default Navbar;