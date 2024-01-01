import { handleSubmitForm } from '@renderer/controller/ScheduleController';
import { useAuth } from '@renderer/model/AuthContext';
import { useRef, useState } from 'react';

function ScheduleForm(): JSX.Element {
  const { user } = useAuth();
  const authorized = user?.role === 'Flight Operations Manager' || user?.role === 'COO';
  const [error, setError] = useState<string>('');

  const airlineNameRef = useRef<HTMLSelectElement>(null);
  const flightNumberRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const departureTimeRef = useRef<HTMLInputElement>(null);

  if (!authorized) {
    return (
      <h1 className="flex flex-row justify-center text-2xl font-bold mt-4">
        You are not authorized.
      </h1>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create Flight Schedule</h2>
      <form
        onSubmit={(e) =>
          handleSubmitForm(
            e,
            airlineNameRef,
            flightNumberRef,
            destinationRef,
            departureTimeRef,
            setError
          )
        }
      >
        <div className="mb-4">
          <label htmlFor="airline-name" className="block text-sm font-medium text-gray-600">
            Airline Name
          </label>
          <select ref={airlineNameRef} className="mt-1 p-2 w-full border rounded-md">
            <option value="Garuda_Indonesia">Garuda Indonesia</option>
            <option value="Batik_Air">Batik Air</option>
            <option value="Air_Asia">Air Asia</option>
            <option value="Citilink">Citilink</option>
            <option value="Super_Air_Jet">Super Air Jet</option>
            <option value="Singapore_Airline">Singapore Airlines</option>
            <option value="Cathay_Pacific">Cathay Pacific</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="flight-number" className="block text-sm font-medium text-gray-600">
            Flight Number
          </label>
          <input type="text" ref={flightNumberRef} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-600">
            Destination
          </label>
          <input type="text" ref={destinationRef} className="mt-1 p-2 w-full border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="departure-time" className="block text-sm font-medium text-gray-600">
            Departure Time
          </label>
          <input
            type="datetime-local"
            ref={departureTimeRef}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Submit Item
        </button>
      </form>
      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ScheduleForm;
