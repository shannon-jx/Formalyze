import React, { useEffect } from 'react';
import './LoginOverlay.css';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import 'firebaseui/dist/firebaseui.css';

const LoginOverlay = ({ closeOverlay }) => {

  const ProviderSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      console.log("User signed in and saved:", user);
      closeOverlay();  // Close overlay after successful login
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Login</h2>
        {/* <form>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit">Submit</button>
        </form> */}
        <button className="google-login-button" onClick={ProviderSignIn}>
          Sign in with Google
        </button>
        <button className="close-button" onClick={closeOverlay}>Close</button>
      </div>
    </div>
  );
};

export default LoginOverlay;
