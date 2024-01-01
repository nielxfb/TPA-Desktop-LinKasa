import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { useAuth } from '@renderer/model/AuthContext';

function NavbarController(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const { user, setUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
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
      {user?.role === 'HRD' && (
        <>
          <a href="/create-staff-data" className="text-white hover:text-gray-300">
            Create Staff Data
          </a>
          <a href="/view-staffs" className="text-white hover:text-gray-300">
            View All Staffs
          </a>
        </>
      )}
      {user?.role === 'Lost and Found Staff' && (
        <a href="/lost-and-found-log" className="text-white hover:text-gray-300">
          View Lost and Found Log
        </a>
      )}
      {(user?.role === 'Flight Operations Manager' ||
        user?.role === 'COO' ||
        user?.role === 'Information Desk Staff' ||
        user?.role === 'Airport Operations Manager' ||
        user?.role === 'Check-in Staff') && (
        <a href="/flight-schedules" className="text-white hover:text-gray-300">
          View Real-time Flight Schedules
        </a>
      )}
      <a href="/chat-room" className="text-white hover:text-gray-300">
        Chat Room
      </a>
      <a href="/feedback" className="text-white hover:text-gray-300">
        Feedback
      </a>
      <a href="/" onClick={() => signOut(auth)} className="text-white hover:text-gray-300">
        Log Out
      </a>
    </>
  );
}

export default NavbarController;
