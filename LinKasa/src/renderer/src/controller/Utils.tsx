import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebase';
import { useState, useEffect } from 'react';
import { collection, where, query, Query } from 'firebase/firestore';

const useLoggedIn = (): boolean => {
  const [isLogged, setIsLogged] = useState<boolean>(false);

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
  const [email, setEmail] = useState<string>('');

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

export { useLoggedIn, useEmail, queryFromCollection };
