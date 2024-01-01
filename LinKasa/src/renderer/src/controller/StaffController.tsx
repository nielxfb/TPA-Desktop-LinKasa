import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { queryFromCollection } from './Utils';
import { User } from '@renderer/model/User';

function StaffController(
  e: React.FormEvent<HTMLFormElement>,
  name: string,
  dob: string,
  address: string,
  role: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  hrdEmail: string,
  hrdPassword: string
): void {
  e.preventDefault();

  const checkUniqueName = async (): Promise<boolean> => {
    const querySnapshot = await getDocs(queryFromCollection('users', 'name', name));
    return querySnapshot.empty;
  };

  const checkUniqueEmail = async (email: string): Promise<boolean> => {
    const querySnapshot = await getDocs(queryFromCollection('users', 'email', email));
    return querySnapshot.empty;
  };

  const generateUniqueEmail = async (firstName: string, lastName: string): Promise<string> => {
    let counter = 1;
    let email = `${firstName}${lastName}@linkasa.co`;

    while (!(await checkUniqueEmail(email))) {
      email = `${firstName}${lastName}.${('00' + counter).slice(-3)}@linkasa.co`;
      counter++;
    }

    return email;
  };

  const createStaff = async (): Promise<void> => {
    const birthDate = new Date(dob).getTime();
    const currDate = new Date().getTime();
    const eighteenInMs = new Date('1988-01-01').getTime();
    const ageInMs = currDate - birthDate;
    const ageValid = ageInMs >= eighteenInMs;

    if (!ageValid) {
      setError('Staff must be more than 18 years old!');
      return;
    }

    const nameArray = name.split(' ');
    const firstName = nameArray[0].toLowerCase();
    const lastName =
      nameArray.length > 1 ? `.${nameArray[nameArray.length - 1].toLowerCase()}` : '';

    const email = await generateUniqueEmail(firstName, lastName);
    const password = `linkasa${dob.replace(/-/g, '')}`;

    const usersRef = collection(db, 'users');

    const data = {
      address: address,
      dob: Timestamp.fromDate(new Date(dob)),
      email: email,
      name: name,
      password: password,
      role: role
    };

    const isNameUnique = await checkUniqueName();
    const isEmailUnique = await checkUniqueEmail(email);

    if (isNameUnique && ageValid && isEmailUnique) {
      addDoc(usersRef, data).then(() => {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
          alert(`Successfully created new staff data!\nEmail: ${email}\nPassword: ${password}`);
          signInWithEmailAndPassword(auth, hrdEmail, hrdPassword).then(() => {
            window.location.reload();
          });
        });
      });
    } else {
      setError('Staff already exists!');
      return;
    }
  };

  createStaff();
}

export const fetchStaffs = async (): Promise<User[]> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('name'));

  const users: User[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as User);
  });

  return users;
};

export const updateRole = async (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  name: string,
  role: string
): Promise<void> => {
  setIsModalOpen(false);

  const q = queryFromCollection('users', 'name', name);
  const querySnapshot = await getDocs(q);
  let docRef: DocumentReference | undefined;

  querySnapshot.forEach((doc) => {
    docRef = doc.ref;
  });

  if (docRef && role) {
    updateDoc(docRef, {
      role: role
    }).then(() => {
      alert('Successfully updated staff role!');
    });
  }
};

export const removeStaff = async (
  name: string,
  hrdEmail: string,
  hrdPassword: string
): Promise<void> => {
  const q = queryFromCollection('users', 'name', name);
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    signInWithEmailAndPassword(auth, doc.data().email, doc.data().password).then(() => {
      deleteUser(auth.currentUser!).then(() => {
        deleteDoc(doc.ref).then(() => {
          alert('Staff removed successfully.');
          signInWithEmailAndPassword(auth, hrdEmail, hrdPassword).then(() => {
            window.location.reload();
          });
        });
      });
    });
  });
};

export default StaffController;
