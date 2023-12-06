import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ReactModal from 'react-modal';
import { Item } from '@renderer/model/Item';
import { useRoleCheck } from '@renderer/controller/Utils';
import {
  fetchLostItems,
  handleEditStatus,
  handleRemoveItem,
  handleStatusChange,
  useOpenModal
} from '@renderer/controller/ItemController';

const LostAndFoundLog = (): JSX.Element => {
  const authorized = useRoleCheck(['Lost and Found Staff']);
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItemName, setSelectedItemName] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchLostItems().then((items) => {
      setLostItems(items);
    });
  }, []);

  if (!authorized) {
    return (
      <h1 className="flex flex-row justify-center text-2xl font-bold mt-4">
        You are not authorized.
      </h1>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-4 gap-2">
      <h1 className="text-2xl font-bold">Lost and Found Items Log</h1>
      {lostItems.length === 0 ? (
        <p>No items found in the Lost and Found log.</p>
      ) : (
        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">No.</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Date Found</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {lostItems.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={`Lost Item ${index + 1}`}
                      className="max-w-full"
                    />
                  )}
                </td>
                <td className="border px-4 py-2">{item.found_at?.toDate().toLocaleString()}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="text-center">
                  <div className="inline-flex justify-center p-1">
                    <button
                      className="bg-green-500 text-white py-1 px-2 rounded-md mr-2"
                      onClick={() => useOpenModal(setSelectedItemName, setIsModalOpen, item.name)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded-md"
                      onClick={() => handleRemoveItem(item.name)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}
      <Link
        to="/lost-and-found-log/update"
        className="mt-2 px-4 py-2 text-white bg-slate-500 rounded-md shadow-lg"
      >
        Update Lost and Found Log
      </Link>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() =>
          handleEditStatus(selectedStatus, setError, setIsModalOpen, selectedItemName)
        }
        contentLabel="Status Modal"
      >
        <div className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-xl font-bold">Please set the status</h1>
          <div className="flex flex-row gap-2 mt-4">
            <button
              onClick={() => handleStatusChange(selectedStatus, setSelectedStatus, 'Unclaimed')}
              className={`text-white px-4 py-2 rounded-md ${
                selectedStatus === 'Unclaimed' ? 'bg-red-500' : 'bg-gray-500'
              }`}
            >
              Unclaimed
            </button>
            <button
              onClick={() =>
                handleStatusChange(selectedStatus, setSelectedStatus, 'Returned to Owner')
              }
              className={`text-white px-4 py-2 rounded-md ${
                selectedStatus === 'Returned to Owner' ? 'bg-green-500' : 'bg-gray-500'
              }`}
            >
              Returned to Owner
            </button>
          </div>
          <button
            onClick={() =>
              handleEditStatus(selectedStatus, setError, setIsModalOpen, selectedItemName)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Close
          </button>
        </div>
      </ReactModal>
      <Outlet />
    </div>
  );
};

export default LostAndFoundLog;
