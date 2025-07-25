import { useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';
import { useSyncExpenses } from './firebaseHooks/useSyncExpenses';
// import { useGetAllExpenses } from './firebaseHooks/useGetAllExpenses';
import { getAllExpenses } from './firebaseHooks/getAllExpenses';
import { signInWithEmailAndPassword } from 'firebase/auth';
import "./Auth.css"
import { icons } from './constants';
import { useDeleteUser } from './firebaseHooks/useDeleteUser';
import CustomNotification from './customs/CustomNotification';

export default function Auth({ setIsOpen, setIsLoggedInModal }) {
  // const firebaseExpenses = useGetAllExpenses();
  const { deleteUserAccount } = useDeleteUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInfo, setAuthInfo] = useLocalStorage("auth", {})
  const [localExpenses, setLocalExpenses] = useLocalStorage("expenses", []);
  const [error, setError] = useState('');
  const { syncExpenses } = useSyncExpenses();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDeleteVer, setIsDeleteVer] = useState(false);
  const [isNotification, setIsNotification] = useState(false);

  useEffect(() => {
    if (auth?.currentUser?.email && authInfo["isAuth"]) {
      setIsLoggedIn(true);
      setIsLoggedInModal(true);
    }
  }, [])

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setIsLoggedInModal(true);
      const authData = {
        userID: result.user.uid,
        email: result.user.email,
        isAuth: true
      };
      setAuthInfo(authData);
      await syncExpenses(authData["userID"]);
      const firebaseExpenses = await getAllExpenses(authData["userID"]);
      setLocalExpenses(firebaseExpenses);
      console.log(firebaseExpenses);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        console.log('Invalid email');
        setError("Please enter a valid email.");
      }
      else if (err.code === 'auth/missing-password' || err.code === 'auth/missing-email') {
        console.log('Missing section');
        setError('Please fill all required sections');
      }
      else if (err.code === 'auth/invalid-credential') {
        console.log('Incorrect mail');
        setError('Incorrect email or password');
      }
      else if (err.code === 'auth/too-many-requests') {
        console.log('Too many requests');
        setError('Too many requests, try again later yazain');
      }
      else {
        console.log("Login failed", err.message);
        setError("Something went wrong, try again later");
      }
    }
  };

  const handlelogOut = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setIsLoggedInModal(false);
    setLocalExpenses([])
    setAuthInfo({});

  }

  const handleSignUp = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setIsLoggedInModal(true);
      const authData = {
        userID: result.user.uid,
        email: result.user.email,
        isAuth: true
      };
      setAuthInfo(authData);
      await syncExpenses(authData["userID"]);
      setEmail('');
      setPassword('');
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        console.log('Invalid email');
        setError("Please enter a valid email.");
      }
      else if (err.code === 'auth/missing-password' || err.code === 'auth/missing-email') {
        console.log('Missing section');
        setError('Please fill all required sections');
      }
      else if (err.code === 'auth/weak-password') {
        console.log('Password must be 6 characters');
        setError("Password should be at least 6 characters");
      }
      else if (err.code === 'auth/email-already-in-use') {
        console.log("Email already in use")
        setError("Email already in use")
      }
      else if (err.code === 'auth/too-many-requests') {
        console.log('Too many requests');
        setError('Too many requests, try again later yazain');
      }
      else {
        console.log("Sign up failed", err.message);
        setError("Something went wrong, try again later");
      }
    }
  }

  const deleteAccount = async () => {
    setIsNotification(true);
    setIsDeleteVer(false);
    await deleteUserAccount(authInfo['userID']);
    await handlelogOut();
  }


  return (
    <div className='auth-wrapper'>
      <div className='auth-logged-in'>
        {isLoggedIn &&
          <div className='settings-body'>
            <div className='settings-category-container'>
              <div className='settings-category-title'></div>
              <div className='settings-item-container'>
                <div className='settings-item' onClick={handlelogOut}>
                  <span>Log out</span>
                  {/* <img src={icons["Arrow"]} className='arrow'></img> */}
                </div>
                <div className='settings-item last-item' onClick={() => setIsDeleteVer(true)}>
                  <span className='delete'>Delete account</span>
                </div>

                {isDeleteVer &&
                  <div className='delete-verify-overlay'>
                    <div className='delete-verify-container'>
                      <div>Are you sure you want to delete the user?</div>
                      <div>This action cannot be undone.</div>
                      <div>All your expenses will be removed.</div>
                      <div className='delete-verify-buttons'>
                        <div className='delete-verify-button accept' onClick={deleteAccount}>Yes</div>
                        <div className='delete-verify-button refuse' onClick={() => setIsDeleteVer(false)}>No</div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
            {/* <button onClick={handlelogOut}>Log out</button> */}
            {/* <div>{auth?.currentUser?.email}</div> */}
            {/* <div onClick={() => setIsOpen()}>back</div> */}
          </div>

        }
      </div>

      <div className='auth-logged-out'>
        {!isLoggedIn &&
          <div className='auth-logout-wrapper'>
            <div className='auth-login-title'>
              {/* <div>Login</div> */}
            </div>

            <div className='auth-inputs-container'>
              <div className='auth-input-container'>
                <div className='auth-inputs-title'> Email </div>
                <input className='auth-input-holder' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className='auth-input-container'>
                <div className='auth-inputs-title'> Password </div>
                <input className='auth-input-holder' type='password' placeholder='Enter your password' onChange={(e) => setPassword(e.target.value)} />
                <div className='auth-error'>{error ? `*${error}` : ''}</div>
              </div>

              <div className='auth-buttons-container'>
                <div className='auth-button sign-in' onClick={handleSignIn}>Login</div>
                <div className='auth-button sign-up' onClick={handleSignUp}>Sign up</div>
              </div>
              <div className='auth-guest-text' onClick={() => setIsOpen()}> Continue as a guest </div>
            </div>
          </div>
        }
        {isNotification &&
          <CustomNotification duration={4000} setIsOpen={setIsNotification} className='settings-notification'>
            <div className='delete-notification'>Deleted account</div>
          </CustomNotification>}
      </div>

    </div>
  )
}
