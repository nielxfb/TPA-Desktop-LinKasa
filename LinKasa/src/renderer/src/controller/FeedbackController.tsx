import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore';
import { db } from './../../../firebase/firebase';
import { Feedback } from '@renderer/model/Feedback';
import { Response } from '@renderer/model/Response';
import { queryFromCollection } from './Utils';

const fetchFeedbacks = async (): Promise<Feedback[]> => {
  const feedbackRef = collection(db, 'feedback');
  const q = query(feedbackRef, orderBy('created_at'));

  const querySnapshot = await getDocs(q);
  const feedbacks: Feedback[] = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const feedbackData = doc.data() as Feedback;
      const responseRef = collection(doc.ref, 'response');
      const responseQuery = query(responseRef);

      const responseSnapshot = await getDocs(responseQuery);
      const responses: Response[] = responseSnapshot.docs.map(
        (responseDoc) => responseDoc.data() as Response
      );

      feedbackData.response = responses;
      return feedbackData;
    })
  );

  return feedbacks;
};

const handleNewFeedback = (
  e,
  nameRef: React.RefObject<HTMLInputElement>,
  descriptionRef: React.RefObject<HTMLInputElement>,
  setError: React.Dispatch<React.SetStateAction<string>>
): void => {
  e.preventDefault();

  const name = nameRef.current?.value;
  const description = descriptionRef.current?.value;

  if (name === '' || description === '') {
    setError('Please fill in all fields!');
    return;
  } else {
    setError('');
  }

  if (name) {
    const feedbackRef = queryFromCollection('feedback', 'name', name);
    getDocs(feedbackRef).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        setError('Name already exists!');
        return;
      } else {
        setError('');

        const feedbackRef = collection(db, 'feedback');
        addDoc(feedbackRef, {
          name: name,
          description: description,
          created_at: Timestamp.fromDate(new Date())
        })
          .then(() => {
            alert('Successfully added new feedback!');
            window.location.reload();
          })
          .catch(() => {
            alert('error adddoc');
          });
      }
    });
  }
};

const handleNewResponse = (e, feedbackName: string, sender: string, response: string): void => {
  e.preventDefault();
  const feedbackRef = queryFromCollection('feedback', 'name', feedbackName);
  getDocs(feedbackRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const feedbackDoc = doc.ref;
        const responseRef = collection(feedbackDoc, 'response');
        addDoc(responseRef, {
          sender: sender,
          response: response,
          created_at: Timestamp.fromDate(new Date())
        })
          .then(() => {
            alert('Successfully added new response!');
            window.location.reload();
          })
          .catch(() => {
            alert('error adddoc');
          });
      });
    })
    .catch(() => {
      alert('error getdocs');
    });
};

const handleUpdateFeedback = (
  updatedNameRef: React.RefObject<HTMLInputElement>,
  updatedDescriptionRef: React.RefObject<HTMLInputElement>,
  currFeedbackName: string,
  setError: React.Dispatch<React.SetStateAction<string>>
): void => {
  const name = updatedNameRef.current?.value;
  const description = updatedDescriptionRef.current?.value;

  if (name === '' || description === '') {
    setError('Please fill in all fields!');
    return;
  } else {
    setError('');
  }

  const feedbackRef = queryFromCollection('feedback', 'name', currFeedbackName);
  getDocs(feedbackRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, {
          name: name,
          description: description
        })
          .then(() => {
            alert('Successfully updated feedback!');
            window.location.reload();
          })
          .catch(() => {
            alert('error updatedoc');
          });
      });
    })
    .catch(() => {
      alert('error getdocs');
    });
};

const handleRemoveFeedback = (feedbackName: string): void => {
  const feedbackRef = queryFromCollection('feedback', 'name', feedbackName);
  getDocs(feedbackRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref).then(() => {
        alert('Successfully removed feedback!');
        window.location.reload();
      });
    });
  });
};

export {
  fetchFeedbacks,
  handleNewFeedback,
  handleNewResponse,
  handleUpdateFeedback,
  handleRemoveFeedback
};
