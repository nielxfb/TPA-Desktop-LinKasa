import { useEffect, useState } from 'react'
import Utils from '../controller/Utils';
import { collection, getDocs } from 'firebase/firestore';
import { Schedule } from '@renderer/model/Schedule';
import { fetchSchedules } from '@renderer/controller/ScheduleController';

function FlightSchedules() {
  const authorized = Utils.useRoleCheck(['Flight Operations Manager', 'COO']);
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    fetchSchedules().then((result) => {
      setSchedules(result);
    })
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
      <h1 className='text-2xl font-bold'>Flight Schedules</h1>
      {schedules.length === 0 ? (
        <p>No flights found in the flight schedules.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th className='border px-4 py-2'>No.</th>
              <th className='border px-4 py-2'>Airline</th>
              <th className='border px-4 py-2'>Flight Number</th>
              <th className='border px-4 py-2'>Destination</th>
              <th className='border px-4 py-2'>Departure Time</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={index}>
                <td className='border px-4 py-2'>{index + 1}</td>
                <td className='border px-4 py-2'>{schedule.airline_path &&
                  <img
                    src={schedule.airline_path}
                    alt={`Airline ${index + 1}`}
                    className='max-w-full'
                  />
                }
                </td>
                <td className='border px-4 py-2'>{schedule.flight_number}</td>
                <td className='border px-4 py-2'>{schedule.destination}</td>
                <td className='border px-4 py-2'>
                  {schedule.departure_time?.toDate().toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default FlightSchedules
