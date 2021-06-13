
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import React, { useState,useRef } from "react";



firebase.initializeApp({
  apiKey: "AIzaSyDM7Foe5mDk35eK3iwamNrUGgQWthpJp9Y",
    authDomain: "superchat-c0a3b.firebaseapp.com",
    projectId: "superchat-c0a3b",
    storageBucket: "superchat-c0a3b.appspot.com",
    messagingSenderId: "334347904681",
    appId: "1:334347904681:web:d449d62a09ae5be5ababb8",
    measurementId: "G-9BEEFRN8FL"


})

const auth= firebase.auth();
const firestore = firebase.firestore();


function App() {


  const [user]= useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <h1>Depth Yeah Random Chat !</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/> }
      </section>


    </div>
  );
}

function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);

  }

  return (
    <>
    <button className ="sign-in" onClick ={signInWithGoogle}>Sign in with Google</button>
    <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick ={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy =useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages]= useCollectionData(query , {idField: 'id'});

  const [formValue, setFormValue] =useState('');
  const sendMessage = async(e) =>{

    e.preventDefault();

    const {uid,photoURL}= auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({behavio: 'smooth'});

  }

  return (
    <>

<main>
  {messages && messages.map(msg => <ChatMessage  key ={msg.id} message={msg}/>)}
  <span ref={dummy}></span>
</main>

<form onSubmit={sendMessage}>
  <input value ={formValue} onChange={(e)=> setFormValue(e.target.value)}  placeholder="say something !"/>
  <button type='submit'  disabled={!formValue}>Send</button>
</form>

</>
  )
 
}

function ChatMessage(props){
  const {text, uid , photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'reveived';
  return( <>
    <div className ={`message ${messageClass}`}>
      <img alt ="image" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
      <p>{text}</p>
    </div> 
    </>
  )
}

export default App;
