// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import adminApp from '../../lib/firebaseAdmin.js'
import {adminClaims} from '../../roles.js'
import { useEffect, useState } from 'react'

export default async function handler(req, res) {
  try {
    const listUsersResult = await adminApp.auth().listUsers(1000);
    let technicians = [];
    listUsersResult.users.forEach((userRecord) => {
      if (userRecord.customClaims && userRecord.customClaims.technician) {
        technicians.push({ uid: userRecord.uid, email: userRecord.email });
      }
    });
    res.status(200).json(technicians);
  } catch (error) {
    console.log('Error fetching technicians:', error);
    res.status(500).send(error);
  }
}