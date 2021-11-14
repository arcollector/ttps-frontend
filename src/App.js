import React, {useState} from 'react';
import firebase from './shared/utils/Firebase';
import 'firebase/compat/auth';
import { ToastContainer } from 'react-toastify';
import { Navigation } from './Navigation';

function App() {

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  firebase.auth().onAuthStateChanged(currentUser=>{
    

    if(!currentUser?.emailVerified){
      firebase.auth().signOut();
      setUser(null);
    }else{
      setUser(currentUser);
    }
    setIsLoading(false);
    
  
  });   

  if(isLoading){
    return null;
  }
  
  return (
    <>
      {!user
        ? <Navigation.Guest />
        : <Navigation.Host user={user}/>
      }
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover={false}
      />
    </>
  );
}



export default App;
