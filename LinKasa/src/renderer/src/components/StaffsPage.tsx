import { fetchStaffs, removeStaff, updateRole } from '@renderer/controller/StaffController';
import { User } from '@renderer/model/User';
import ReactModal from 'react-modal';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@renderer/model/AuthContext';

function StaffsPage(): JSX.Element {
  const { user } = useAuth();
  const authorized = user?.role === 'HRD';
  const hrdEmail = user?.email ? user.email : '';
  const hrdPassword = user?.password ? user.password : '';
  const [staffName, setStaffName] = useState<string>('');
  const [staffs, setStaffs] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const roleRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    fetchStaffs().then((staffs) => setStaffs(staffs));
  }, [isModalOpen, staffName]);

  const useOpenModal = (selectedName: string): void => {
    setStaffName(selectedName);
    setIsModalOpen(true);
  };

  if (!authorized) {
    return (
      <h1 className="flex flex-row justify-center text-2xl font-bold mt-4">
        You are not authorized.
      </h1>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {staffs.map((staff, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-md">
            <p className="font-bold">Name: {staff.name}</p>
            <p>Email: {staff.email}</p>
            <p>Date of Birth: {new Date(staff.dob.toDate()).toLocaleDateString()}</p>
            <p>Role: {staff.role}</p>
            <p>Address: {staff.address}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => useOpenModal(staff.name)}
                className="bg-green-500 text-white py-1 px-2 rounded-md"
              >
                Update Role
              </button>
              <button
                onClick={() => removeStaff(staff.name, hrdEmail, hrdPassword)}
                className="bg-red-500 text-white py-1 px-2 rounded-md"
              >
                Remove Staff
              </button>
            </div>
          </div>
        ))}
      </div>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() =>
          updateRole(setIsModalOpen, staffName, roleRef.current?.value ? roleRef.current.value : '')
        }
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <h1 className="text-2xl font-bold">Update Role</h1>
          <select ref={roleRef} className="mt-4 p-2 w-full border rounded-md" required>
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
            <option value="Logistic Manager">Logistic Manager</option>
            <option value="Fuel Manager">Fuel Manager</option>
            <option value="Cargo Handlers">Cargo Handlers</option>
            <option value="Civil Engineering Manager">Civil Engineering Manager</option>
            <option value="CEO">Airport Director/CEO</option>
            <option value="CFO">Chief Financial Officer (CFO)</option>
            <option value="COO">Chief Operations Officer (COO)</option>
            <option value="CSO">Chief Security Officer (CSO)</option>
          </select>
          <button
            onClick={() =>
              updateRole(
                setIsModalOpen,
                staffName,
                roleRef.current?.value ? roleRef.current.value : ''
              )
            }
            className="bg-green-500 text-white py-2 px-4 rounded-md"
          >
            Update Role
          </button>
        </div>
      </ReactModal>
    </>
  );
}

export default StaffsPage;
