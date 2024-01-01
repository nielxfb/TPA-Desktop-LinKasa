import {
  fetchFeedbacks,
  handleNewResponse,
  handleRemoveFeedback,
  handleUpdateFeedback
} from '@renderer/controller/FeedbackController';
import { useAuth } from '@renderer/model/AuthContext';
import { Feedback } from '@renderer/model/Feedback';
import { useEffect, useRef, useState } from 'react';

function FeedbackPage(): JSX.Element {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [viewingResponse, setViewingResponse] = useState<string | null>(null);
  const [updatingFeedback, setUpdatingFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const responseRef = useRef<HTMLInputElement>(null);

  const updatedNameRef = useRef<HTMLInputElement>(null);
  const updatedDescriptionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFeedbacks().then((result) => {
      setFeedbacks(result);
    });
  }, []);

  const handleResponseOpened = (feedbackName: string): void => {
    if (viewingResponse === feedbackName) {
      setViewingResponse(null);
    } else {
      setViewingResponse(feedbackName);
    }
  };

  const handleUpdateOpened = (feedbackName: string): void => {
    if (updatingFeedback === feedbackName) {
      setUpdatingFeedback(null);
    } else {
      setUpdatingFeedback(feedbackName);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      {feedbacks.length === 0 && (
        <p className="flex flex-col justify-center items-center text-xl font-bold mt-4">
          No feedbacks found.
        </p>
      )}
      {feedbacks.map((feedback, index) => (
        <div key={index} className="flex flex-col border p-4 gap-2">
          <h1 className="font-bold text-xl">{feedback.name}</h1>
          <h2>{feedback.description}</h2>
          {user?.role === 'Customer Service Manager' ? (
            <>
              <div className="flex flex-row gap-2">
                <button
                  onClick={() => handleResponseOpened(feedback.name)}
                  className="text-white bg-green-500 py-2 px-4 rounded-md"
                >
                  View feedback responses
                </button>
                <button
                  onClick={() => handleUpdateOpened(feedback.name)}
                  className="text-white bg-blue-500 py-2 px-4 rounded-md"
                >
                  Update feedback
                </button>
                <button
                  onClick={() => handleRemoveFeedback(feedback.name)}
                  className="text-white bg-red-500 py-2 px-4 rounded-md"
                >
                  Remove feedback
                </button>
              </div>
              {feedback.response.length == 0 && viewingResponse === feedback.name && (
                <p className="flex flex-col justify-center items-center text-xl font-bold mt-4">
                  No responses found.
                </p>
              )}
              {feedback.response.map((response, index) => (
                <div
                  key={index}
                  className={`${viewingResponse === feedback.name ? 'block' : 'hidden'} border p-4`}
                >
                  <h1 className="font-bold text-xl">{response.sender}</h1>
                  <h2>{response.response}</h2>
                </div>
              ))}
              <div
                className={`${updatingFeedback === feedback.name ? 'block' : 'hidden'} border p-4`}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">Feedback Name</label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    ref={updatedNameRef}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Feedback Description
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border rounded-md"
                    ref={updatedDescriptionRef}
                    required
                  />
                </div>
                {error && (
                  <div className="text-red-500 mb-4">
                    <p>{error}</p>
                  </div>
                )}
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md"
                  onClick={() =>
                    handleUpdateFeedback(
                      updatedNameRef,
                      updatedDescriptionRef,
                      feedback.name,
                      setError
                    )
                  }
                >
                  Update
                </button>
              </div>
            </>
          ) : (
            <form
              onSubmit={(e) =>
                handleNewResponse(
                  e,
                  feedback.name,
                  user?.name ? user.name : '',
                  responseRef.current?.value ? responseRef.current.value : ''
                )
              }
              className="flex flex-row gap-2"
            >
              <input type="text" className="border p-2" ref={responseRef} required />
              <button className="bg-green-500 px-4 py-2 rounded-md text-white" type="submit">
                Submit
              </button>
            </form>
          )}
        </div>
      ))}
      <div className="flex flex-row items-center justify-center">
        <a href="/create-feedback" className="text-white bg-green-500 py-2 px-4 rounded-md m-4">
          Create new feedback
        </a>
      </div>
    </div>
  );
}

export default FeedbackPage;
