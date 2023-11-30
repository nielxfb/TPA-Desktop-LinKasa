import React, { useEffect, useState } from 'react'
import Utils from '../controller/Utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { Link, Outlet } from 'react-router-dom';

const LostAndFoundLog = () => {
  const authorized = Utils.useRoleCheck('Lost and Found Staff');
  const [lostItems, setLostItems] = useState([]);

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
  }, [authorized]);

  const handleRemoveItem = () => {
    // remove item from firebase firestore
    const itemsRef = collection(db, 'items');

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
                    <button className='bg-green-500 text-white py-1 px-2 rounded-md mr-2'>Edit</button>
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
      <Link
        to='/lost-and-found-log/update'
        className='mt-2 px-4 py-2 text-white bg-slate-500 rounded-md shadow-lg'
      >
        Update Lost and Found Log
      </Link>
      <Outlet />
    </div>
  )
}

export default LostAndFoundLog
