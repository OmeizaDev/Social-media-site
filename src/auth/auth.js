// src/auth/auth.js

import { auth } from "../firebase/firebase.js";
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { getUserById } from "../utils/storage.js";

export async function createAccount(newUser) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    newUser.email,
    newUser.password
  );

  return credential.user;
}

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export function getAuthenticatedUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();

      if (!firebaseUser) {
        resolve(null);
        return;
      }

      const profile = await getUserById(firebaseUser.uid);

      resolve({
        ...profile, id: firebaseUser.uid
      });
    });
  });
}

export async function logout() {
  await signOut(auth);
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}