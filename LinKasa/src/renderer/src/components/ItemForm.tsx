import { useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { closeModal, handleNewItem, handleStatusChange } from '@renderer/controller/ItemController';
import { useAuth } from '@renderer/model/AuthContext';

ReactModal.setAppElement('#root');

function ItemForm(): JSX.Element {
  const { user } = useAuth();
  const authorized = user?.role === 'Lost and Found Staff';
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

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
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Update Lost and Found Log</h2>
      <form onSubmit={(e) => handleNewItem(e, setIsModalOpen)}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input type="text" ref={nameRef} className="mt-1 p-2 w-full border rounded-md" required />
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
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Submit Item
        </button>
      </form>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() =>
          closeModal(setIsModalOpen, selectedStatus, setError, nameRef, descriptionRef, imageRef)
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
              closeModal(
                setIsModalOpen,
                selectedStatus,
                setError,
                nameRef,
                descriptionRef,
                imageRef
              )
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
          >
            Close
          </button>
        </div>
      </ReactModal>
    </div>
  );
}

export default ItemForm;
