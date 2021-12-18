import React, { useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";
import { ToastContainer } from "react-toastify";
import { Navigation } from "./Navigation";
import { AuthContext } from "./contexts";
import { User, actions as authActions } from "./Auth";

function InnerApp() {
  const history = useHistory();
  const [userAuthenticated, setUserAuthenticated] =
    useState<firebase.User | null>(null);
  const [userFromFirestore, setUserFromFirestore] = React.useState<User | null>(
    null
  );

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUserAuthenticated(currentUser);
      } else if (!currentUser) {
        setUserAuthenticated(null);
        setUserFromFirestore(null);
        setIsLogged(false);
        history.replace("/");
      }
    });
    return unsubscribe;
  }, [history]);

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

  const [isLogged, setIsLogged] = React.useState(false);
  React.useEffect(() => {
    if (userAuthenticated && userFromFirestore) {
      setIsLogged(true);
      history.replace("/");
    }
  }, [userAuthenticated, userFromFirestore, history]);

  React.useEffect(() => {
    (async () => {
      if (userAuthenticated && userAuthenticated.email && !userFromFirestore) {
        const user = await authActions.getUserByEmail(userAuthenticated.email);
        if (user) {
          setUserFromFirestore(user);
        }
      }
    })();
  }, [userAuthenticated, userFromFirestore]);

  return (
    <AuthContext.Provider value={authContextReducer}>
      {userAuthenticated && userFromFirestore && isLogged ? (
        <Navigation.Host
          user={userAuthenticated}
          userFromFirestore={userFromFirestore}
        />
      ) : (
        <Navigation.Guest isLoading={userAuthenticated ? true : false} />
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
