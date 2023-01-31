 import firebase, {auth, database} from '../../lib/firebase.js'
 import { useState, useEffect, useRef} from "react";
 import { collection, query, where, getDocs, collectionGroup, onSnapshot, deleteDoc , getDoc, setDoc, updateDoc} from "firebase/firestore";
 import { doc } from 'firebase/firestore';
 import ticket from './ticket.js';
 import ReactDOM from 'react-dom';
 import dynamic from 'next/dynamic'
 import React from 'react';
 import ReactModal from 'react-modal';
 import styles from '../../styles/Dashboard.module.css'
 import fetch from 'isomorphic-unfetch'
 
 
 const ticketRef = collection(database, 'tickets')
 const q = query(ticketRef, where("deleted", "==", false))

 console.log(q)
 
 const assign = () => {
 
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const technicianDefaultSelect = ""
   const [ticketDetails, setTicketDetails] = useState(null);
   const [assignModalIsOpen, setAssignModalIsOpen] = useState(false);
   const [technicians, setTechnicians] = useState([]);
   const [selectedTechnician, setSelectedTechnician] = useState(null);
   const [assignDoc, setAssignDoc] = useState(null);
   const [options, setOptions] = useState([]);
   const [tickets, setTickets] = useState([]);
   const [showUndo, setShowUndo] = useState(false);
   const [recentlyDeleted, setRecentlyDeleted] = useState(null)

   function handleUndo() {
     // Perform undo action here

     updateDoc(doc(collection(database, "tickets"), recentlyDeleted.id), {

      
      deleted:false
      
    });
    console.log(recentlyDeleted.id)
     setShowUndo(false);
   };

   useEffect(() => {
    // Fetch the list of technicians
    fetch('../api/getTechnicians')
      .then((response) => response.json())
      .then((technicians) => { 
        setTechnicians(technicians);
        console.log(technicians)
      })
      .catch((error) => {
        console.log('Error fetching technicians:', error);
      });
  }, []);

  async function deleteDocument(documentId) {

    updateDoc(doc(collection(database, "tickets"), documentId.id), {

      deleted:true
      
    });
    setModalIsOpen(false)
    setRecentlyDeleted(documentId)
    setShowUndo(true)

  }


     const handleDetailsClick = (doc,  id) => {
         setModalIsOpen(true);
         const selectedTicket = doc;
         setTicketDetails(selectedTicket);       
       }
 
     const handleAssignClick = (doc) => {
         setAssignModalIsOpen(true)  
         setAssignDoc(doc)
     }
     

     
     const cafeListRef = useRef(null);

     useEffect(() => {
      onSnapshot(q, (snapshot) => {
        setTickets(snapshot.docs)
      })
     }, [])
     
       return (
         <div>
       <ul>
        {tickets.map((doc) => {
          return(
            <li className={styles.ticketsli} key={doc.id}>
                       <span className={styles.ticketsspan}>Document ID: {doc.id}</span>
                       <span className={styles.ticketsspan}>Title: {doc.data().title}</span>
                       <span className={styles.ticketsspan}>Description: {doc.data().desc}</span>
                       <span className={styles.ticketsspan}>Address: {doc.data().address}</span>
                       <span className={styles.ticketsspan}>Technician: {doc.data().assignedTechnician}</span>
                       <span className={styles.ticketsspan}>Date: {new Date(doc.data().dateCreated).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }</span>
                       <div className={styles.buttons}>
                           <button onClick={() => handleDetailsClick(doc, doc.id)} className={styles.ticketsbtn}>Details</button>
                           <button onClick={() => handleAssignClick(doc)} className={styles.ticketsbtn}>Assign</button>
                       </div>   
                   </li>
          )
        })}
       </ul>
       {ticketDetails ? (
     <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className={styles.modal}>  
       <h1>{ticketDetails.data().title}</h1>
       <p>Description: {ticketDetails.data().desc}</p>
       <p>Address: {ticketDetails.data().address}</p>
       <button onClick={() => deleteDocument(ticketDetails)}>Delete</button>
       <button onClick={() => setModalIsOpen(false)}>Close</button>
     </ReactModal>
   ) : null}
 
 <div>
 <ReactModal isOpen={assignModalIsOpen} onRequestClose={() => setAssignModalIsOpen(false)} className={styles.modal}>  

 <h1>Select Technician</h1>

 <label>Technician:   
 <select value={selectedTechnician} onChange={(event) => setSelectedTechnician(event.target.value)} onLoad={(event) => setSelectedTechnician(event.target.value)}>
  <option>Dispatch</option>
        {technicians.map((technician) => (
         
          <option key={technician.uid} value={technician.uid}>{technician.email}</option>

        ))}
        
        
      </select>
      </label>
      <button onClick={() => {
            updateDoc(doc(collection(database, "tickets"), assignDoc.id), {

    
            assignedTechnician:selectedTechnician
            
          });
      }}>Assign</button>
       <button onClick={() => setAssignModalIsOpen(false)}>Close</button>
     </ReactModal>
    </div>

    {showUndo && (
        <div className={styles.undo_button_container}>
          <div className={styles.undo_button} onClick={handleUndo}>
            Undo
          </div>
        </div>
      )}
     </div>
   );
 };
 
 export default assign;
 
 
 
     
 
 