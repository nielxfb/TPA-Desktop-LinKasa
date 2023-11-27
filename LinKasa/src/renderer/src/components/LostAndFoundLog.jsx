import React, { useEffect, useState } from 'react'
import Utils from '../controller/Utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { Link } from 'react-router-dom';

const LostAndFoundLog = () => {
  const authorized = Utils.useRoleCheck('Lost and Found Staff');
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      if(!authorized) return;
      const q = collection(db, 'lost_items');
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
                  {item.image && <img src={item.image} alt={`Lost Item ${index + 1}`} className='max-w-full' />}
                </td>
                <td className='border px-4 py-2'>{item.date_found}</td>
                <td>
                  <button>Edit</button>
                  <button>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link href='/lost-and-found-log/update' className='mt-2 px-4 py-2 text-white bg-slate-500 rounded-md shadow-lg'>Update Lost and Found Log</Link>
    </div>
  )
}

export default LostAndFoundLog
