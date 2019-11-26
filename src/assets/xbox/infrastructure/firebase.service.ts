import { Injectable } from '@angular/core';

import * as firebaseApp from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.FIREBASE_DATABASEURL,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKETID,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public get firestore(): firebase.firestore.Firestore {
    return firebaseApp.firestore();
  }

  constructor() {
    firebaseApp.initializeApp(firebaseConfig);
  }

}
