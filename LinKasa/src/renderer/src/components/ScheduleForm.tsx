import { useRoleCheck } from '@renderer/controller/Utils';
import { useRef } from 'react';

function ScheduleForm(): JSX.Element {
  const authorized = useRoleCheck(['Flight Operations Manager', 'COO']);

  const airlineNameRef = useRef<HTMLSelectElement>(null);
  const flightNumberRef = useRef<HTMLInputElement>(null);

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
      <form onSubmit={() => {}}>
        <div className="mb-4">
          <label htmlFor="airline-name" className="block text-sm font-medium text-gray-600">
            Airline Name
          </label>
          <select ref={airlineNameRef}>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
            <option value="Air Asia">Air Asia</option>
            <option value="Citilink">Citilink</option>
            <option value="Super Air Jet">Super Air Jet</option>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
            <option value="Garuda Indonesia">Garuda Indonesia</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="flight-number" className="block text-sm font-medium text-gray-600">
            Flight Number
          </label>
          <input type="text" ref={flightNumberRef} />
        </div>
      </form>
    </div>
  );
}

export default ScheduleForm;
