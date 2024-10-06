import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const firebaseConfig = {
  apiKey: "AIzaSyDkRl-rXPp3nCHwxrP3yfY0eAXnh_fmk30",
  authDomain: "formalyze-ec725.firebaseapp.com",
  projectId: 'formalyze-ec725',
  storageBucket: "formalyze-ec725.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:1037229349268:web:ac131cca3befa5edced781",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const uiConfig = {
  signInOptions: [
    "google.com",
  ],
  signInSuccessUrl: '../Home', 
  signInFlow: 'popup',
};

function Login() {
  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);
  }, []);



 function  ProviderSignIn(){
    const provider = new GoogleAuthProvider();

    const signInWithProvider = async ()=>
   { 
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
    }
    catch (error){
      console.error("Error during sign-in:", error);
    }
  }

 }
  


  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh'
    }}>
      <h1>Login</h1>
      <div id="firebaseui-auth-container"></div>

    </div>
  );
}

export default Login;