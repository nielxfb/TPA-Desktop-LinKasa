import React, { useEffect, useState } from 'react'
import Utils from '../controller/Utils';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase.config';

function FlightSchedules() {
  const authorized = Utils.useRoleCheck('Flight Operations Manager') || Utils.useRoleCheck('COO');
  const [departures, setDepartures] = useState([]);

  useEffect(() => {
    const fetchDepartures = async () => {
      const q = collection(db, 'departures');
      const querySnapshot = await getDocs(q);
      const departure = [];
      querySnapshot.forEach((doc) => {
        const departureData = doc.data();
        departure.push(departureData);
      });

      setDepartures(departure);
    }

    fetchDepartures();
  }, []);

  if(!authorized){
    return (
      <h1 className='flex flex-row justify-center text-2xl font-bold mt-4'>
        You are not authorized.
      </h1>
    )
  }

  return (
    <div className='flex flex-col justify-center items-center mt-4 gap-2'>
      <h1 className='text-2xl font-bold'>Departure Schedules</h1>
      {departures.length === 0 ? (
        <p>No departure schedules found.</p>
      ) : (
        <table className='table-auto'>
          <thead>
            <tr>
              <th className='border px-4 py-2'>No.</th>
              <th className='border px-4 py-2'>Airline</th>
              <th className='border px-4 py-2'>Departure Time</th>
              <th className='border px-4 py-2'>Destination</th>
              <th className='border px-4 py-2'>Flight Number</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((departure, index) => (
              <tr key={index}>
                <td className='border px-4 py-2'>{index + 1}</td>
                <td className='border px-4 py-2'>
                  {departure.airline_path && <img src={departure.airline_path} alt={`Airline ${index + 1}`} className='max-w-full' />}
                </td>
                <td className='border px-4 py-2'>{departure.departure_time?.toDate().toLocaleString()}</td>
                <td className='border px-4 py-2'>{departure.destination}</td>
                <td className='border px-4 py-2'>{departure.flight_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default FlightSchedules
