import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import LoginForm from '../components/LoginForm';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { useAuth } from '@renderer/model/AuthContext';

function LayoutController(): JSX.Element {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { user, setUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
        setLogged(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const setUserAttributes = async (): Promise<void> => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const { name, role, email, password, dob, address } = userData;
        setUser({ name, role, email, password, dob, address });
      });
    };

    if (email) {
      setUserAttributes();
    }
  }, [email]);

  return (
    <>
      {logged && (
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mt-4">Hello, {user?.name}!</h1>
          <h2 className="text-xl">What can we help you today?</h2>
        </div>
      )}

      {!logged && <LoginForm />}
    </>
  );
}

export default LayoutController;
