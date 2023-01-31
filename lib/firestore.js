import {db} from "./firebase.js"
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

//Collection Reference
const colRef = collection(db, 'cities2')

//Get Collection Data
getDocs(colRef)
  .then((snapshot) => {

    let cities = []
snapshot.docs.forEach((doc) => {

     cities.push({...doc.data()})

   })
console.log(cities)
})


//Adding Documents

const addCityForm = document.querySelector('.add')
addCityForm.addEventListener('submit', (e) => {
    e.preventDefault(0)
    addDoc(colRef, {
        country: addCityForm.country.value,
        state: addCityForm.state.value,
        name: addCityForm.name.value,
    })
    .then(() => {
        addCityForm.reset()
    })
})

//Deleting Documents

const deleteCityForm = document.querySelector('.delete')
deleteCityForm.addEventListener('submit', (e) => {
    e.preventDefault(0)
})