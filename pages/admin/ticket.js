import {getAuth} from 'firebase/auth';
import React from 'react';
import {useAuthState} from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react';
import firebase, {auth, database} from '../../lib/firebase.js'
import jsonwebtoken from 'jsonwebtoken'
import {doc, setDoc, addDoc, collection, getFirestore} from "firebase/firestore"
import "firebase/firestore";
import {useJsApiLoader, GoogleMap, Marker} from "@react-google-maps/api"
import Autocomplete from "react-google-autocomplete";

import styles from '../../styles/Login.module.css'


const ticket = () => {
    const [user, setUser] = useState(null)
    const [contact, setContact] = useState({title: "", desc: "", address: ""})
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)
    const [locationUID, setLocationUID] = useState(null)
    const [isAddressValid, setIsAddressValid] = useState(false);
    const db = getFirestore()

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

    //Firestore, handle user input
    
    const handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setContact((prev) => {
  
            return { ...prev, [name]: value}
  
        })}

    const doSomething = function (e) {
        setDoc(doc(collection(db, "tickets")), {
            title: contact.title,
            desc: contact.desc,
            address: selectedPlace,
            assignedTech: "",
            status: "open",
            dateCreated: new Date().toISOString(),
            deleted:false,
            longitude:long,
            latitude:lat,
            locationUID: locationUID,
            currentDispatchEvent: ""

          });
        e.preventDefault();
        e.target.reset();
        setContact({title: "", desc: "", address: ""})
    }

    if(!user) {
        return (<>Loading...</>)
      }
    
      const decodedAt = jsonwebtoken.decode(user.accessToken);
    
      if(!decodedAt.admin) {
        return <>You are not an admin!</>
      }

      return (
        <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
  <form onSubmit={doSomething} className={styles.formTest}>
    <h1 className={styles.formTitle}>Ticket Entry</h1>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Title</label>
      <input className={styles.formInput} type="text" name="title" value={contact.title} onChange={handleChange} placeholder="Ticket Title" />
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Address</label>
      <Autocomplete className={styles.formInput} name="autocomplete" apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} onPlaceSelected={(place) => {
        setSelectedPlace(place.formatted_address)
        setLocationUID(place.place_id)
        const lat = place.geometry.location.lat()
        const long = place.geometry.location.lng()
        setLat(lat)
        setLong(long)
      }} options={{types:[]}} />
    </div>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Description</label>
      <textarea className={styles.formTextArea} name="desc" value={contact.desc} onChange={handleChange} placeholder="Ticket Description"></textarea>
    </div>
    <div className={styles.formGroup}>
      <button className={styles.formButton} type='submit'>Save Ticket</button>
    </div>
  </form>
</div>
</div>
      )}

      export default ticket