import React, { useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { ToastContainer } from "react-toastify";
import { Navigation } from "./Navigation";
import { AuthContext } from "./contexts";
import { User } from "./Auth";

function InnerApp() {
  const history = useHistory();
  const [userAuthenticated, setUserAuthenticated] =
    useState<firebase.User | null>(null);
  const [userFromFirestore, setUserFromFirestore] = React.useState<User | null>(
    null
  );

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (currentUser && currentUser.emailVerified) {
      setUserAuthenticated(currentUser);
      history.replace("/");
    } else if (!currentUser) {
      setUserAuthenticated(null);
      setUserFromFirestore(null);
      history.replace("/");
    }
  });

  const authContextReducer = React.useMemo(
    () => ({
      setUserFromFirestore(user: User) {
        setUserFromFirestore(user);
      },
      getUserFromFirestore(): User | null {
        return userFromFirestore;
      },
    }),
    [userFromFirestore]
  );

  return (
    <AuthContext.Provider value={authContextReducer}>
      {userAuthenticated && userFromFirestore ? (
        <Navigation.Host
          user={userAuthenticated}
          userFromFirestore={userFromFirestore}
        />
      ) : (
        <Navigation.Guest />
      )}
    </AuthContext.Provider>
  );
}

export function App() {
  return (
    <Router>
      <InnerApp />
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
    </Router>
  );
}
