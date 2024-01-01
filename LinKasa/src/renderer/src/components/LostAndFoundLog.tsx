import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ReactModal from 'react-modal';
import { Item } from '@renderer/model/Item';
import {
  fetchLostItems,
  handleEditStatus,
  handleRemoveItem,
  handleStatusChange,
  useOpenModal
} from '@renderer/controller/ItemController';
import { useAuth } from '@renderer/model/AuthContext';

const LostAndFoundLog = (): JSX.Element => {
  const { user } = useAuth();
  const authorized = user?.role === 'Lost and Found Staff';
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

  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

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
          handleEditStatus(
            selectedStatus,
            setError,
            setIsModalOpen,
            selectedItemName,
            nameRef,
            descriptionRef,
            imageRef
          )
        }
      >
        <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Update Lost and Found Log</h2>
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
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              ref={nameRef}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <input
              type="text"
              ref={descriptionRef}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-600">
              Image
            </label>
            <input
              type="file"
              ref={imageRef}
              className="mt-1 p-2 w-full border rounded-md"
              accept="image/*"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 mb-4">
              <p>{error}</p>
            </div>
          )}
          <button
            onClick={() =>
              handleEditStatus(
                selectedStatus,
                setError,
                setIsModalOpen,
                selectedItemName,
                nameRef,
                descriptionRef,
                imageRef
              )
            }
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Update Item
          </button>
        </div>
      </ReactModal>
      <Outlet />
    </div>
  );
};

export default LostAndFoundLog;
