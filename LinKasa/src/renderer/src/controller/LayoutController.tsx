import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import LoginForm from '../components/LoginForm';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';

function LayoutController() {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');

  onAuthStateChanged(auth, (user) => {
    if(user){
      setEmail(user.email);
      setLogged(true);
    }
  });

  const usersRef = collection(db, "users");
  const q = query(usersRef, where('email', '==', email));

  useEffect(() => {
    const setUserAttributes = async () => {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setName(userData.name);
      });
    }

    setUserAttributes();
  }, [q, name]);

  return (
    <>
      {logged && (
        <div className='flex flex-col justify-center items-center'>
          <h1 className='text-2xl font-bold mt-4'>Hello, {name}!</h1>
          <h2 className='text-xl'>
            What can we help you today?
          </h2>
        </div>
      )}

      {!logged && (
        <LoginForm />
      )}
    </>
  )
}

export default LayoutController
