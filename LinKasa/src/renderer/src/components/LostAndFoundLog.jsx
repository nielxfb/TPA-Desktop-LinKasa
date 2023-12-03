import React, { useEffect, useState } from 'react'
import Utils from '../controller/Utils';
import { collection, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../../firebase.config';
import { Link, Outlet } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
import ReactModal from 'react-modal';

const LostAndFoundLog = () => {
  const authorized = Utils.useRoleCheck('Lost and Found Staff');
  const [lostItems, setLostItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLostItems = async () => {
      if(!authorized) return;
      const q = collection(db, 'items');
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        const itemData = doc.data();
        items.push(itemData);
      });

      setLostItems(items);
    }

    fetchLostItems();
  }, []);

  const useOpenModal = (itemName) => {
    setSelectedItemName(itemName);
    setIsModalOpen(true);
  }

  const handleStatusChange = (status) => {
    if(selectedStatus === status) setSelectedStatus('');
    else if(selectedStatus != status) setSelectedStatus(status);
  }

  const handleEditStatus = async () => {
    if(selectedStatus === ''){
      setError('Please set item status!');
      setIsModalOpen(false);
      return;
    } else {
      setError('');
    }

    const q = Utils.queryFromCollection('items', 'name', selectedItemName);
    const querySnapshot = await getDocs(q);
    let docRef;
    querySnapshot.forEach((doc) => {
      docRef = doc.ref;
    });

    if(docRef){
      await updateDoc(docRef, {
        status: selectedStatus
      });

      alert('Successfully updated item status!');
      window.location.reload();
    }
  }

  const handleRemoveItem = async (itemName) => {
    const q = Utils.queryFromCollection('items', 'name', itemName);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const url = userData.image_url;
      if(url) {
        const storageRef = ref(storage, url);
        deleteObject(storageRef).then(() => {
          deleteDoc(doc.ref).then(() => {
            alert('Item removed successfully.');
            window.location.reload();
          });
        });
      }
    });
  }

  if(!authorized){
    return (
      <h1 className='flex flex-row justify-center text-2xl font-bold mt-4'>You are not authorized.</h1>
    )
  }

  return (
    <div className='flex flex-col justify-center items-center mt-4 gap-2'>
      <h1 className='text-2xl font-bold'>Lost and Found Items Log</h1>
      {lostItems.length === 0 ? (
        <p>No items found in the Lost and Found log.</p>
      ) : (
        <table className='table-auto'>
          <thead>
            <tr>
              <th className='border px-4 py-2'>No.</th>
              <th className='border px-4 py-2'>Name</th>
              <th className='border px-4 py-2'>Description</th>
              <th className='border px-4 py-2'>Image</th>
              <th className='border px-4 py-2'>Date Found</th>
              <th className='border px-4 py-2'>Status</th>
              <th className='border px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {lostItems.map((item, index) => (
              <tr key={index}>
                <td className='border px-4 py-2'>{index + 1}</td>
                <td className='border px-4 py-2'>{item.name}</td>
                <td className='border px-4 py-2'>{item.description}</td>
                <td className='border px-4 py-2'>
                  {item.image_url && <img src={item.image_url} alt={`Lost Item ${index + 1}`} className='max-w-full' />}
                </td>
                <td className='border px-4 py-2'>{item.found_at?.toDate().toLocaleString()}</td>
                <td className='border px-4 py-2'>{item.status}</td>
                <td className='text-center'>
                  <div className='inline-flex justify-center p-1'>
                    <button
                      className='bg-green-500 text-white py-1 px-2 rounded-md mr-2'
                      onClick={() => useOpenModal(item.name)}
                    >
                      Edit
                    </button>
                    <button
                      className='bg-red-500 text-white py-1 px-2 rounded-md'
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
        to='/lost-and-found-log/update'
        className='mt-2 px-4 py-2 text-white bg-slate-500 rounded-md shadow-lg'
      >
        Update Lost and Found Log
      </Link>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={handleEditStatus}
        contentLabel='Status Modal'
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
          <button onClick={handleEditStatus} className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>Close</button>
        </div>
      </ReactModal>
      <Outlet />
    </div>
  )
}

export default LostAndFoundLog
