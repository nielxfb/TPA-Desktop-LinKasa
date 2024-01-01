import { handleNewFeedback } from '@renderer/controller/FeedbackController';
import { useRef, useState } from 'react';

function NewFeedbackForm(): JSX.Element {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Feedback</h2>
      <form onSubmit={(e) => handleNewFeedback(e, nameRef, descriptionRef, setError)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input type="text" ref={nameRef} className="mt-1 p-2 w-full border rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <input
            type="text"
            ref={descriptionRef}
            className="mt-1 p-2 w-full border rounded-md"
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
          Create Feedback
        </button>
      </form>
    </div>
  );
}

export default NewFeedbackForm;
