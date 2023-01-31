
import {getAuth} from 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react';
import firebase, {auth} from '../../lib/firebase.js'
import jsonwebtoken from 'jsonwebtoken'
import styles from '../../styles/Dashboard.module.css'
import Link from 'next/link.js';

const dashboard = () => {
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
    return <>Loading...</>
  }

  const decodedAt = jsonwebtoken.decode(user.accessToken);

  console.log(decodedAt)

  if(!decodedAt.admin) {
    return <>You are not an admin!</>
  }

  console.log(user.accessToken)
  return(
    <div className={styles.gridcontainer}>
    <div className={styles.griditem}>User Management</div>
    <Link href="./assign"><div className={styles.griditem}>Dispatch Board</div></Link>
    <Link href="./ticket"><div className={styles.griditem}>Ticket Creation</div></Link>
    <div className={styles.griditem}>4</div>
    <div className={styles.griditem}>5</div>
    <div className={styles.griditem}>6</div>
    <div className={styles.griditem}>7</div>
    <div className={styles.griditem}>8</div>
    <div className={styles.griditem}>9</div>
  </div>
  )


}

export default dashboard;