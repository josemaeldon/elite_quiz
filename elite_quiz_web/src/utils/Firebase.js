'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { getAuth } from 'firebase/auth'
import { useSelector } from 'react-redux'
import { websettingsData } from '@/store/reducers/webSettings'
import { getFirestore } from 'firebase/firestore'
import { setFcmId } from '@/store/reducers/settingsSlice'
import toast from 'react-hot-toast'
import { updateFcmIdApi } from '@/api/apiRoutes'

const FirebaseData = () => {
  const websettingsdata = useSelector(websettingsData)

  const firebaseConfig = {
    apiKey: websettingsdata?.firebase_api_key,
    authDomain: websettingsdata?.firebase_auth_domain,
    databaseURL: websettingsdata?.firebase_database_url,
    projectId: websettingsdata?.firebase_project_id,
    storageBucket: websettingsdata?.firebase_storage_bucket,
    messagingSenderId: websettingsdata?.firebase_messager_sender_id,
    appId: websettingsdata?.firebase_app_id,
    measurementId: websettingsdata?.firebase_measurement_id
  }
  let app
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }
  const auth = getAuth(app)
  const db = getFirestore(app)

  const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

const messagingInstance = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    } else {
      // createStickyNote();
      return null;
    }
  } catch (err) {
    console.error('Error checking messaging support:', err);
    return null;
  }
};
const fetchToken = async (setFcmToken) => {
  
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {

      
      const messaging = await messagingInstance();
      if (!messaging) {
        console.error('Messaging not supported.');
        return;
      }
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              updateFcmIdApi({ web_fcm_id: currentToken });
              setFcmId(currentToken);
              setFcmToken(currentToken);
            } else {
              toast.error('Permission required for notifications.');
            }
          })
          .catch((err) => {
            console.error('Error retrieving token:', err);
            // If the error is "no active Service Worker", try to register the service worker again
            if (err.message.includes('no active Service Worker')) {
              registerServiceWorker();
            }
          });
      } else {
        // toast.error('Permission is required for notifications.');
        // console.log('Permission denied');
      }
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
  }
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        // After successful registration, try to fetch the token again
        fetchToken();
      })
      .catch((err) => {
        // console.log('Service Worker registration failed: ', err);
      });
  }
};

const onMessageListener = async () => {
  const messaging = await messagingInstance();
  if (messaging) {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  } else {
    console.error('Messaging not supported.');
    return null;
  }
};
const signOut = () => {
  return auth.signOut();
};


  return { auth, db,fetchToken, onMessageListener, signOut , firebaseApp: app }
}
export default FirebaseData
