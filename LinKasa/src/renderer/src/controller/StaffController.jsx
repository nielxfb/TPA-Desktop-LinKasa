import { auth, db } from '../../../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Utils from '../controller/Utils';
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';

function StaffController(e, name, dob, address, role, setError) {
  e.preventDefault();

  const checkUniqueName = async () => {
    const querySnapshot = await getDocs(Utils.queryFromCollection('users', 'name', name));
    return querySnapshot.empty;
  };

  const checkUniqueEmail = async (email) => {
    const querySnapshot = await getDocs(Utils.queryFromCollection('users', 'email', email));
    return querySnapshot.empty;
  };

  const generateUniqueEmail = async (firstName, lastName) => {
    let counter = 1;
    let email = `${firstName}${lastName}@linkasa.co`;

    while (!(await checkUniqueEmail(email))) {
      email = `${firstName}${lastName}.${('00' + counter).slice(-3)}@linkasa.co`;
      counter++;
    }

    return email;
  };

  const createStaff = async () => {
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
    const lastName = nameArray.length > 1 ? `.${nameArray[nameArray.length - 1].toLowerCase()}` : '';

    const email = await generateUniqueEmail(firstName, lastName);
    const password = `linkasa${dob.replace(/-/g, '')}`;

    const usersRef = collection(db, 'users');

    const data = {
      address: address,
      dob: Timestamp.fromDate(new Date(dob)),
      email: email,
      name: name,
      password: password,
      role: role,
    };

    if (await checkUniqueName() && ageValid && await checkUniqueEmail(email)) {
      await addDoc(usersRef, data);
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Successfully created new staff data!');
      window.location.reload();
    } else {
      setError('Staff already exists!');
    }
  };

  createStaff();
}

export default StaffController
