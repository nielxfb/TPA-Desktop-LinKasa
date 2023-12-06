import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import NavbarController from '../controller/NavbarController';
import { auth } from '../../../firebase/firebase';

function Navbar(): JSX.Element {
  const [logged, setLogged] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLogged(true);
    }
  });

  return (
    <nav className="bg-slate-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-2xl font-bold">
          LinKasa
        </a>
        <div className="space-x-4">
          {!logged && (
            <a href="/" className="text-white hover:text-gray-300">
              Login
            </a>
          )}

          {logged && <NavbarController />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
