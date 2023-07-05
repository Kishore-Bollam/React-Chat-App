import './App.css';
import React , {useState,useRef} from 'react'
import firebase from "firebase/compat/app"
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import'firebase/analytics'
import {useAuthState}  from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

// firebase configuration for ur app
firebase.initializeApp({
  apiKey: "AIzaSyBlNHRZmGV6Bdexe0vtvaYDXsyHuBAIGO4",
  authDomain: "chat-app-482f4.firebaseapp.com",
  projectId: "chat-app-482f4",
  databaseURL: "https:/chat-app-482f4.firebaseio.com",
  storageBucket: "chat-app-482f4.appspot.com",
  messagingSenderId: "72064642115",
  appId: "1:72064642115:web:4ca395ff1c75226d0cb8f6",
  measurementId: "G-N6L2GYWBE9"
}); 

const auth = firebase.auth();
const firestore = firebase.firestore(); 

function App() {
  //to athenticate the user
  const [user] = useAuthState(auth)


  
  return (
    <div className="App">
      <header>
        <h1>welcome  Lets Talk !!!</h1>
        <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
     
   

    </div>
  );
}

 function SignIn(){
  const SignInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
    <button className='sign-in' onClick={SignInWithGoogle}>SignIn With Google</button>
    <p> Lets connect to talk and grow Togeather....!!!  #we will rock</p>
    
    </>
  )

}

function SignOut(){
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )

}
function ChatRoom(){
  const [formValue , setFormValue] = useState("")

  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(1000);

  const [messages] = useCollectionData(query,{idField : "id"})



  
  const SendMessage = async (e)=>{
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser;
    await messagesRef.add(
      {
        text:formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
      setFormValue('');
      dummy.currentUser.scrollIntoView({behavior :'smooth'});

  }

  return(
    <>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message = {msg}/>)}
    <form onSubmit={SendMessage}>
     <input value={formValue} placeholder='Tell me something!' onChange={(e)=> setFormValue(e.target.value)}></input>
     <button type='submit' disabled={!formValue}>GO</button>
    </form>
    </>
  )

}
function ChatMessage(props){
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" :"recive";

  return(

    <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt=''/>
      <p>{text}</p>
      </div>
      </>
  )

}

export default App;
