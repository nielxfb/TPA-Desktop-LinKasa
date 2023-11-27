import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../../firebase.config";
import { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";

const useLoggedIn = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const check = () => {
      onAuthStateChanged(auth, (user) => {
        setIsLogged(!!user);
      });
    }

    check();
  }, []);

  return isLogged;
}

const useEmail = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const check = () => {
      onAuthStateChanged(auth, (user) => {
        setEmail(user ? user.email : '');
      });
    }

    check();
  }, [])

  return email;
}

const queryFromCollection = (collectionName, field, target) => {
  const usersRef = collection(db, collectionName);
  return query(usersRef, where(field, '==', target));
}

const useRoleCheck = (role) => {
  const loggedIn = useLoggedIn();
  const email = useEmail();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if(!loggedIn) return;

      const q = queryFromCollection('users', 'email', email);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.role === role) {
          setIsAuthorized(true);
        }
      })
    }

    checkRole();
  }, [loggedIn, email, role]);

  return isAuthorized;
}

export default { useLoggedIn, useEmail, queryFromCollection, useRoleCheck }
