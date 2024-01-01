import { useState } from 'react';
import StaffController from '../controller/StaffController';
import { useAuth } from '@renderer/model/AuthContext';

function NewStaffForm(): JSX.Element {
  const { user } = useAuth();
  const authorized = user?.role === 'HRD';
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [role, setRole] = useState<string>('Customer Service Manager');
  const [error, setError] = useState<string>('');
  const hrdEmail = user?.email ? user.email : '';
  const hrdPassword = user?.password ? user.password : '';

  if (!authorized) {
    return (
      <h1 className="flex flex-row justify-center text-2xl font-bold mt-4">
        You are not authorized.
      </h1>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Staff</h2>
      <form
        onSubmit={(e) =>
          StaffController(e, name, dob, address, role, setError, hrdEmail, hrdPassword)
        }
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
          <input
            type="date"
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Role</label>
          <select
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="Customer Service Manager">Customer Service Manager</option>
            <option value="Information Desk Staff">Information Desk Staff</option>
            <option value="Lost and Found Staff">Lost and Found Staff</option>
            <option value="Check-in Staff">Check-in Staff</option>
            <option value="Gate Agents">Gate Agents</option>
            <option value="Airport Operations Manager">Airport Operations Manager</option>
            <option value="Flight Operations Manager">Flight Operations Manager</option>
            <option value="Ground Handling Manager">Ground Handling Manager</option>
            <option value="Ground Handling Staff">Ground Handling Staff</option>
            <option value="Landside Operations Manager">Landside Operations Manager</option>
            <option value="Maintenance Manager">Maintenance Manager</option>
            <option value="Maintenance Staff">Maintenance Staff</option>
            <option value="Customs and Border Control Officers">
              Customs and Border Control Officers
            </option>
            <option value="Baggage Security Supervisor">Baggage Security Supervisor</option>
            <option value="Baggage Security Staff">Baggage Security Staff</option>
            <option value="Cargo Manager">Cargo Manager</option>
            <option value="Logistics Manager">Logistics Manager</option>
            <option value="Fuel Manager">Fuel Manager</option>
            <option value="Cargo Handlers">Cargo Handlers</option>
            <option value="Civil Engineering Manager">Civil Engineering Manager</option>
            <option value="CEO">Airport Director/CEO</option>
            <option value="CFO">Chief Financial Officer (CFO)</option>
            <option value="COO">Chief Operations Officer (COO)</option>
            <option value="CSO">Chief Security Officer (CSO)</option>
          </select>
        </div>
        {error ? (
          <div className="text-red-500 mb-4">
            <p>{error}</p>
          </div>
        ) : null}
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Create Staff
        </button>
      </form>
    </div>
  );
}

export default NewStaffForm;
