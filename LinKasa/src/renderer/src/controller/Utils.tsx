import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, where, query, Query } from 'firebase/firestore';

const useLoggedIn = (): boolean => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const check = (): void => {
      onAuthStateChanged(auth, (user) => {
        setIsLogged(!!user);
      });
    };

    check();
  }, []);

  return isLogged;
};

const useEmail = (): string => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const check = (): void => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.email) setEmail(user ? user.email : '');
      });
    };

    check();
  }, []);

  return email;
};

const queryFromCollection = (collectionName: string, field: string, target: string): Query => {
  const usersRef = collection(db, collectionName);
  return query(usersRef, where(field, '==', target));
};

const useRoleCheck = (roles: string[]): boolean => {
  const loggedIn = useLoggedIn();
  const email = useEmail();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async (): Promise<void> => {
      if (!loggedIn) return;

      const q = queryFromCollection('users', 'email', email);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (roles.includes(userData.role)) {
          setIsAuthorized(true);
        }
      });
    };

    checkRole();
  }, [loggedIn, email, roles]);

  return isAuthorized;
};

export { useLoggedIn, useEmail, queryFromCollection, useRoleCheck };
