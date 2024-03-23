import { Injectable } from '@angular/core';

import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

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


  private app: FirebaseApp;
  public get db() : Firestore {
    return getFirestore(this.app);
  }

  constructor() {
    this.app = initializeApp(firebaseConfig);
  }

}
