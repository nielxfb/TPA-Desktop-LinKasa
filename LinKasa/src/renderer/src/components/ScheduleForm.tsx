import { useRoleCheck } from '@renderer/controller/Utils';
import { useRef } from 'react';

function ScheduleForm(): JSX.Element {
  const authorized = useRoleCheck(['Flight Operations Manager', 'COO']);

  const airlineNameRef = useRef<HTMLInputElement>(null);

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
          <label htmlFor="name" className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            ref={airlineNameRef}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
      </form>
    </div>
  );
}

export default ScheduleForm;
