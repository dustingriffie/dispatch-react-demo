import React, { useEffect, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete} from "@react-google-maps/api"

const Home = () => {

  const {googleLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries: ['places']
  })


  return (
    <div>
      
    </div>
  )
}

export default Home
