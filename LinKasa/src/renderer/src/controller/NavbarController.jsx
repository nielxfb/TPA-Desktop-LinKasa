import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../../firebase.config'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

function NavbarController() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  onAuthStateChanged(auth, (user) => {
    if(user){
      setEmail(user.email);
    }
  });

  const usersRef = collection(db, "users");
  const q = query(usersRef, where('email', '==', email));

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setRole(userData.role);
      });
    }

    getUsers();
  }, [q, role]);

  return (
    <>
        {role === 'HRD' && (
          <a href="/create-staff-data" className="text-white hover:text-gray-300">Create Staff Data</a>
        )}
        {role === 'Lost and Found Staff' && (
          <a href="/lost-and-found-log" className="text-white hover:text-gray-300">View Lost and Found Log</a>
        )}
        {(role === 'Flight Operations Manager' || role === 'COO') && (
          <a href="/flight-schedules" className="text-white hover:text-gray-300">View Real-time Flight Schedules</a>
        )}
        <a href="/" onClick={() => signOut(auth)} className="text-white hover:text-gray-300">Log Out</a>
    </>
  )
}

export default NavbarController
