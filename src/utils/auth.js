import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Removed

export class AuthService {
  // Register a new user
  static async register(email, password, name) {
    try {
      // Validate input
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userData = {
        uid: user.uid,
        email: email.toLowerCase(),
        name: name,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      throw this._handleFirebaseError(error);
    }
  }

  // Login user
  static async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user details from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      };

      if (userDoc.exists()) {
        userData = { ...userData, ...userDoc.data() };
      }

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw this._handleFirebaseError(error);
    }
  }

  // Logout user
  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check if user is logged in
  // Note: For Firebase, we usually use onAuthStateChanged in App.js
  // safely returning the current user if initialized
  static isLoggedIn() {
    return !!auth.currentUser;
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }

      return {
        uid: user.uid,
        email: user.email,
        name: user.displayName
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUser(updatedData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);

      // Also update auth profile if name changed
      if (updatedData.name) {
        await updateProfile(user, { displayName: updatedData.name });
      }

      return { success: true, user: { ...(await this.getCurrentUser()), ...updatedData } };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static _handleFirebaseError(error) {
    let message = error.message;
    if (error.code === 'auth/email-already-in-use') {
      message = 'Email is already in use';
    } else if (error.code === 'auth/invalid-email') {
      message = 'Invalid email address';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = 'Invalid email or password';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }
    return new Error(message);
  }
}
