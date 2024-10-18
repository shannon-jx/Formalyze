import React, { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import * as firebaseui from 'firebaseui';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
// import 'firebaseui/dist/firebaseui.css';

// const uiConfig = {
//   signInOptions: [
//     "google.com",
//   ],
//   signInSuccessUrl: '../Home',
//   signInFlow: 'popup',
// };

function Login() {
  // useEffect(() => {
  //   const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
  //   ui.start('#firebaseui-auth-container', uiConfig);
  // }, []);

  const ProviderSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      console.log("User signed in and saved:", user);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <h1>Login</h1>
      {/* <div id="firebaseui-auth-container" onClick={ProviderSignIn}></div> */}
      <button onClick={ProviderSignIn}>Sign in with Google</button>
    </div>
  );
}

export default Login;