import { Timestamp, addDoc, getDocs } from 'firebase/firestore';
import React, { useState } from 'react';
import { auth } from '../../../../firebase.config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Utils from '../controller/Utils';

function NewStaffForm() {
  const authorized = Utils.useRoleCheck('HRD');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('Customer Service Manager');
  const [error, setError] = useState('');

  if(!authorized){
    return (
      <h1 className='flex flex-row justify-center text-2xl font-bold mt-4'>You are not authorized.</h1>
    );
  }

  const handleCreateStaff = async (e) => {
    e.preventDefault();

    let q = Utils.queryFromCollection('users', 'name', name);
    let querySnapshot = await getDocs(q);
    let nameUnique = querySnapshot.empty;

    if(!nameUnique){
      setError('Staff already exists!');
      return;
    }

    const birthDate = new Date(dob).getTime();
    const currDate = new Date().getTime();
    const ageInMs = currDate - birthDate;
    const eighteenInMs = new Date('1988-01-01').getTime();

    const ageValid = ageInMs >= eighteenInMs;

    if(!ageValid){
      setError('Staff must be more than 18 years old!');
      return;
    }

    const nameArray = name.split(' ');
    const firstName = nameArray[0].toLowerCase();
    const lastName = nameArray.length > 1 ?
      `.${nameArray[nameArray.length - 1].toLowerCase()}` : '';

    let tempEmail = `${firstName}${lastName}@linkasa.co`;

    q = Utils.queryFromCollection('users', 'email', tempEmail);
    querySnapshot = await getDocs(q);

    let emailUnique = querySnapshot.empty;

    while(!emailUnique){
      let counter = 1;
      tempEmail = `${firstName}${lastName}.${('00' + counter).slice(-3)}@linkasa.co`;

      q = Utils.queryFromCollection('users', 'email', tempEmail);
      querySnapshot = await getDocs(q);

      emailUnique = querySnapshot.empty;
    }

    const email = tempEmail;
    const password = `linkasa${dob.replace(/-/g, '')}`;

    const datas = {
      address: address,
      dob: Timestamp.fromDate(new Date(dob)),
      email: email,
      name: name,
      password: password,
      role: role
    }

    if(nameUnique && ageValid && emailUnique){
      await addDoc(usersRef, datas);

      createUserWithEmailAndPassword(auth, email, password);
      alert('Successfully created new staff data!');

      window.location.reload();
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Staff</h2>
      <form onSubmit={handleCreateStaff}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-600">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-600">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="Customer Service Manager">Customer Service Manager</option>
            <option value="Information Desk Staff">Information Desk Staff</option>
            <option value="Lost and Found Staff">Lost and Found Staff</option>
            <option value="Check-in Staff">Check-in Staff</option>
            <option value="Gate Agents">Gate Agents</option>
            <option value="Air Operations Manager">Air Operations Manager</option>
            <option value="Flight Operations Manager">Flight Operations Manager</option>
            <option value="Ground Handling Manager">Ground Handling Manager</option>
            <option value="Ground Handling Staff">Ground Handling Staff</option>
            <option value="Landside Operations Manager">Landside Operations Manager</option>
            <option value="Maintenance Manager">Maintenance Manager</option>
            <option value="Maintenance Staff">Maintenance Staff</option>
            <option value="Customs and Border Control Officers">Customs and Border Control Officers</option>
            <option value="Baggage Security Supervisor">Baggage Security Supervisor</option>
            <option value="Baggage Security Staff">Baggage Security Staff</option>
            <option value="Cargo Manager">Cargo Manager</option>
            <option value="Logistic Manager">Logistic Manager</option>
            <option value="Fuel Manager">Fuel Manager</option>
            <option value="Cargo Handlers">Cargo Handlers</option>
            <option value="Civil Engineering Manager">Civil Engineering Manager</option>
            <option value="CEO">Airport Director/CEO</option>
            <option value="CFO">Chief Financial Officer (CFO)</option>
            <option value="COO">Chief Operations Officer (COO)</option>
            <option value="CSO">Chief Security Officer (CSO)</option>
          </select>
        </div>
        {error && (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
          </div>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Create Staff
        </button>
      </form>
    </div>
  )
}

export default NewStaffForm
