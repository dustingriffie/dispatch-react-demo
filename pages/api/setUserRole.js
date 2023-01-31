// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import adminApp from '../../lib/firebaseAdmin.js'
import {adminClaims, technicianClaims} from '../../roles.js'

export default async function handler(req, res) { 
  // Check if access token is even present
  // authentication


  // Authorization
  // Can the user do this (role based)
  //if(!adminApp.auth().verifyIdToken()) {
    // not valid
  //}

  if(req.method !== "POST") {
    throw new Error('Must be post request')
  }

  const {uid, role} = req.body;

  console.log(uid)

  try {
    await adminApp.auth().setCustomUserClaims(uid, adminClaims)
    console.log("Successfully set admin role for user: ", uid);
  } catch(err) {
    console.log(err)
  }

  res.status(200).json({ name: 'John Doe' })
}
