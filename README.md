# Ticket Dispatch System

⚠️ DISCLAIMER: This was a proof of concept demo and not all proper security methods were observed. Use caution using in a production environment!

## Introduction

Welcome to the Ticket Dispatch System! This project is a web-based platform for dispatching tickets and technicians. Users can create tickets and assign them to technicians, and technicians can access and dispatch tickets from their easily accessible Google Maps window.

## Features
- Create tickets
- Assign tickets to technicians
- View dispatched tickets on Google Maps
- Easily accessible interface for technicians

## Technologies
- React
- Next.js
- Firebase
- Firestore
- Firebase Admin

## Prerequisites
- Google API Key
- Firebase API Key
- 'tickets' collection in Firestore
- 'dispatch_events' collection in Firestore
- Currently no method of user management so user custom claims (ex. admin (dispatch) and technician) will need to be set through the API. This will change as project gets further updates.

## Getting Started

1. Clone the repository
```
$ git clone https://github.com/dustingriffie/gps-demo.git
```
2. Install dependencies
```
$ npm install
```
3. Create a `.env.local` file in the root directory
```
$ touch .env.local
```
4. Add your Google API Key and Firebase API Key to the `.env.local` file
```JS
REACT_APP_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
```
5. Add your Firebase API details to the `lib/firebase.js` file
```Javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "XXX",
  databaseURL: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX"
}
```
6. Add your Firebase Admin API details to the 'lib/fireConfig.js' file
```Javascript
export const fireConfig = {
    "type": "XXX",
    "project_id": "XXX",
    "private_key_id": "XXX",
    "private_key": "XXX",
    "client_email": "XXX",
    "client_id": "XXX",
    "auth_uri": "XXX",
    "token_uri": "XXX",
    "auth_provider_x509_cert_url": "XXX",
    "client_x509_cert_url": "XXX"
}
```
7. Start the development server
```
$ npm run dev
```
8. Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

## Conclusion

That's it! You are now ready to use the Ticket Dispatch System. Start creating tickets, assigning them to technicians, and view them on the Google Maps window. Enjoy!
