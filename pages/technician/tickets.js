import firebase, { auth, database } from '../../lib/firebase.js'
import { useState, useEffect, useRef } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  collectionGroup,
  onSnapshot,
  deleteDoc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import ReactDOM from 'react-dom'
import jsonwebtoken, { decode } from 'jsonwebtoken'
import dynamic from 'next/dynamic'
import React from 'react'
import ReactModal from 'react-modal'
import styles from '../../styles/Dashboard.module.css'
import fetch from 'isomorphic-unfetch'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import ticket from '../admin/ticket.js'

const tickets = () => {
  const [map, setMap] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [ticketDetails, setTicketDetails] = useState(null)
  const [showCheck, setShowCheck] = useState(null)
  const [dispatchDetails, setDispatchDetails] = useState(null)
  const [dispatchModalIsOpen, setDispatchModalIsOpen] = useState(false)
  const [dispatchDoc, setDispatchDoc] = useState(null)
  const [tickets, setTickets] = useState([])
  const [dispatchedTo, setDispatchedTo] = useState()
  const [dispatchedID, setDispatchedID] = useState()
  const [dispatchRefresh, setDispatchRefresh] = useState()
  const [timeState, setTimeState] = useState(null)
  const ticketRef = collection(database, 'tickets')
  const dispatchRef = collection(database, 'dispatch_events')
  const [dispatchEvent, setDispatchEvent] = useState(undefined)
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const [initialLng, setInitialLng] = useState(null)
  const [initialLat, setInitialLat] = useState(null)

  const q = query(
    ticketRef,
    where('deleted', '==', false),
    where('assignedTechnician', '==', 'O6M6PYY14GdilPKu4E4YIhtg2p02'),
  )
  const dispatchCheck = query(
    dispatchRef,
    where('technician', '==', 'O6M6PYY14GdilPKu4E4YIhtg2p02'),
    where('status', '==', 'pending'),
  )

  function dispatchHistoryQuery(ticketId) {
    return query(
      dispatchRef,
      where('ticketIDHistory', '==', ticketId)
    )
  }

  const handleDetailsClick = (doc, id) => {
    setModalIsOpen(true)
    const selectedTicket = doc
    setTicketDetails(selectedTicket)
  }

  const handleCloseTicket = () => {
    updateDoc(doc(collection(database, 'tickets'), ticketDetails.id), {
      status: "closed",
      assignedTechnician: "Dispatch",
      currentDispatchEvent: ""
    })
    setDispatchModalIsOpen(false)
  }

  const handleDispatchClick = (doc) => {
    setDispatchModalIsOpen(true)
    const selectedTicket = doc
    setTicketDetails(selectedTicket)
    setDispatchDoc(doc)
    onSnapshot(dispatchHistoryQuery(doc.id), (snapshot) => {
      setDispatchDetails(snapshot.docs)
    })
  }

  const handleStartTravel = async function () {
    const docRes = await addDoc(collection(database, 'dispatch_events'), {
      status: 'pending',
      technician: 'O6M6PYY14GdilPKu4E4YIhtg2p02',
      ticketid: ticketDetails.id,
      ticketIDHistory: ticketDetails.id,
      startTravelTime: new Date().toLocaleDateString('en-US', options),
      endTravelTime: '',
      startWorkTime: '',
      endWorkTime: '',
    })
    setTimeState('startTravel')
  }

  const handleEndTravel = function () {
    updateDoc(doc(collection(database, 'dispatch_events'), dispatchedID), {
      endTravelTime: new Date().toLocaleDateString('en-US', options),
      
    })

  }

  const handleStartWork = function () {
    updateDoc(doc(collection(database, 'dispatch_events'), dispatchedID), {
      startWorkTime: new Date().toLocaleDateString('en-US', options),
    })

  }

  const handleEndWork = function () {
    updateDoc(doc(collection(database, 'dispatch_events'), dispatchedID), {
      endWorkTime: new Date().toLocaleDateString('en-US', options),
      status: 'waiting',
      ticketid: '',
      technician: '',
    })
    setDispatchedTo(undefined) 
    setTimeState(null)
  }

  const cafeListRef = useRef(null)

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setTickets(snapshot.docs)
    })
  }, [])

  useEffect(() => {
    setInitialLat()
  }, [])

  useEffect(() => {
    onSnapshot(dispatchCheck, (snapshot) => {
      snapshot.docs.map((doc) => {
        if (doc.data().ticketid) {
          setDispatchedID(doc.id)
          setDispatchedTo(doc.data().ticketid)
          if (doc.data().startTravelTime) {
            setTimeState('startTravel')
            if (doc.data().endTravelTime) {
              setTimeState('endTravel')
              if (doc.data().startWorkTime) {
                setTimeState('startWork')
                if (doc.data().endWorkTime) {
                  setTimeState('endWork')
                }
              }
            }
          }
        }
      })
    })
  }, [])

  const DispatchButton = () => {
    let caseValue = timeState
    console.log(caseValue)
    switch (caseValue) {
      case 'startTravel':
        return (
          <button
            onClick={() => handleEndTravel()}
            className={styles.dispatchbtn}
          >
            End Travel
          </button>
        )
        break
      case 'endTravel':
        return (
          <button
            onClick={() => handleStartWork()}
            className={styles.dispatchbtn}
          >
            Start Work
          </button>
        )
        break
      case 'startWork':
        return (
          <button onClick={() => handleEndWork()} className={styles.dispatchbtn}>
            End Work
          </button>
        )
        break
      default:
        return (
          <div>
          <button
            onClick={() => handleStartTravel()}
            className={styles.dispatchbtn}
          >
            Start Travel
          </button>
                    <button
                    onClick={() => handleCloseTicket()}
                    className={styles.dispatchbtn}
                  >
                    Close Ticket
                  </button>
                  </div>
        )
        break
    }
  }

  
  return (
    <div>
      <GoogleMap center={{lng: -97.7474347, lat: 30.4318613}} zoom={15}
            mapContainerStyle={{ width: '100%', height: '400px' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            >
      {tickets.map((doc) => {
        if(doc.data().longitude != null || doc.data().longitude != undefined || doc.data().latitude != null || doc.data().latitude != undefined)
          return <Marker position={{lng: doc.data().longitude, lat: doc.data().latitude}} onClick={() => handleDetailsClick(doc, doc.id)} />
        console.log(doc.data().latitude)
      })}
      
      </GoogleMap>
      <ul>
        {tickets.map((doc) => {
          // condition to check if technician is assigned

          if (initialLat != null) {
          setInitialLat(doc.data().latitude)
          setInitialLng(doc.data().longitude)
          }
          return (
            <li className={styles.ticketsli} key={doc.id}>
              <span className={styles.ticketsspan}>Document ID: {doc.id}</span>
              <span className={styles.ticketsspan}>
                Title: {doc.data().title}
              </span>
              <span className={styles.ticketsspan}>
                Description: {doc.data().desc}
              </span>
              <span className={styles.ticketsspan}>
                Address: {doc.data().address}
              </span>
              <span className={styles.ticketsspan}>
                Technician: {doc.data().assignedTechnician}
              </span>
              <span className={styles.ticketsspan}>
                Date:{' '}
                {new Date(doc.data().dateCreated).toLocaleDateString('en-us', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <div className={styles.buttons}>
                <button
                  onClick={() => handleDetailsClick(doc, doc.id)}
                  className={styles.ticketsbtn}
                >
                  Details
                </button>

                {(dispatchedTo === undefined || dispatchedTo === doc.id) && (
                  <button
                    onClick={async () => {
                      handleDispatchClick(doc)

                      onSnapshot(dispatchHistoryQuery(doc.id), (snapshot) => {
                        setDispatchEvent(snapshot.docs)
                      })
                    }}
                    className={styles.ticketsbtn}
                  >
                    Dispatch
                  </button>

                )}
              </div>
            </li>
          )
        })}
      </ul>
      {ticketDetails ? (
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className={styles.modal}
        >
          <h1>{ticketDetails.data().title}</h1>
          <p>Description: {ticketDetails.data().desc}</p>
          <p>Address: {ticketDetails.data().address}</p>

          <GoogleMap
            center={{
              lng: ticketDetails.data().longitude,
              lat: ticketDetails.data().latitude,
            }}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '200px' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker
              position={{
                lng: ticketDetails.data().longitude,
                lat: ticketDetails.data().latitude,
              }}
            />
          </GoogleMap>
          <a
            href={`https://www.google.com/maps/dir//${encodeURIComponent(
              ticketDetails.data().address,
            )}`}
          >
            <button>Open in Maps</button>
          </a>
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </ReactModal>
      ) : null}
      <div>
        <ReactModal
          isOpen={dispatchModalIsOpen}
          onRequestClose={() => setDispatchModalIsOpen(false)}
          className={styles.modal}
        >
          <h1>Dispatch</h1>

          <ul className={styles.headerList}>
  <li className={styles.headerItem}>Start Travel</li>
  <li className={styles.headerItem}>End Travel</li>
  <li className={styles.headerItem}>Start Work</li>
  <li className={styles.headerItem}>End Work</li>
</ul>

{dispatchEvent?.map((event, index) => (
  <ul key={event.data().id || index} className={`${styles.rowList} ${index % 2 === 0 ? styles.odd : ''}`}>
    <li className={styles.rowItem}>{event.data().startTravelTime}</li>
    <li className={styles.rowItem}>{event.data().endTravelTime}</li>
    <li className={styles.rowItem}>{event.data().startWorkTime}</li>
    <li className={styles.rowItem}>{event.data().endWorkTime}</li>
  </ul>
))}
          
          <DispatchButton></DispatchButton>

          <button onClick={() => setDispatchModalIsOpen(false)}>Close</button>
        </ReactModal>
      </div>
    </div>
  )
}

export default tickets
