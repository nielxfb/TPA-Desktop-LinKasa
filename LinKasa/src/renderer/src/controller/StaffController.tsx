import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../firebase/firebase';
import { queryFromCollection } from './Utils';

function StaffController(
  e: React.FormEvent<HTMLFormElement>,
  name: string,
  dob: string,
  address: string,
  role: string,
  setError: React.Dispatch<React.SetStateAction<string>>
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

    if ((await checkUniqueName()) && ageValid && (await checkUniqueEmail(email))) {
      addDoc(usersRef, data).then(() => {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
          alert(`Successfully created new staff data!\nEmail: ${email}\nPassword: ${password}`);
          window.location.reload();
        });
      });
    } else {
      setError('Staff already exists!');
    }
  };

  createStaff();
}

export default StaffController;
