import React, { useState } from 'react'
import Utils from '../controller/Utils'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../../firebase.config';
import ReactModal from 'react-modal';
import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';

ReactModal.setAppElement('#root');

function ItemForm() {
  const authorized = Utils.useRoleCheck('Lost and Found Staff');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleNewItem = (e) => {
    e.preventDefault();

    setIsModalOpen(true);
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  }

  const closeModal = () => {
    setIsModalOpen(false);

    if(!selectedStatus){
      setError('Please set item status!');
      return;
    } else {
      setError('');
    }

    const storageRef = ref(storage, 'images/' + image.name);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const itemsRef = collection(db, 'items');

        addDoc(itemsRef, {
          description: description,
          found_at: Timestamp.fromDate(new Date()),
          image_url: url,
          name: name,
          status: selectedStatus
        }).then(() => {
          alert('Successfully uploaded new lost item!');
          window.location.reload();
        });
      });
    });
  }

  const handleStatusChange = (status) => {
    if(selectedStatus === status) setSelectedStatus('');
    else if(selectedStatus != status) setSelectedStatus(status);
  }

  if(!authorized){
    return (
      <h1 className='flex flex-row justify-center text-2xl font-bold mt-4'>You are not authorized.</h1>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Update Lost and Found Log</h2>
      <form onSubmit={handleNewItem}>
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            id="image"
            name="image"
            onChange={handleImageChange}
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
        onRequestClose={closeModal}
        contentLabel='Status Modal'
        className=''
      >
        <div className='flex flex-col justify-center items-center gap-2'>
          <h1 className='text-xl font-bold'>Please set the status</h1>
          <div className='flex flex-row gap-2 mt-4'>
            <button
              onClick={() => handleStatusChange('Unclaimed')}
              className={`text-white px-4 py-2 rounded-md ${selectedStatus === 'Unclaimed' ? 'bg-red-500' : 'bg-gray-500'}`}
            >
              Unclaimed
            </button>
            <button
              onClick={() => handleStatusChange('Returned to Owner')}
              className={`text-white px-4 py-2 rounded-md ${selectedStatus === 'Returned to Owner' ? 'bg-green-500' : 'bg-gray-500'}`}
            >
              Returned to Owner
            </button>
          </div>
          <button onClick={closeModal} className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>Close</button>
        </div>
      </ReactModal>
    </div>
  )
}

export default ItemForm
