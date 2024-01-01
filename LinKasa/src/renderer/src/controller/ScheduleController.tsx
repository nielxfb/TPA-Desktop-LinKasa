import { Timestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../../firebase/firebase';
import { Schedule } from '@renderer/model/Schedule';
import { queryFromCollection } from './Utils';
import { getDownloadURL, ref } from 'firebase/storage';

const fetchSchedules = async (): Promise<Schedule[]> => {
  const q = collection(db, 'departures');
  const querySnapshot = await getDocs(q);
  const departures: Schedule[] = [];
  querySnapshot.forEach((doc) => {
    departures.push(doc.data() as Schedule);
  });

  return departures;
};

const checkUniqueFlightNumber = async (flightNumber: string): Promise<boolean> => {
  const querySnapshot = await getDocs(
    queryFromCollection('departures', 'flight_number', flightNumber)
  );
  return querySnapshot.empty;
};

const handleSubmitForm = async (
  e: React.FormEvent<HTMLFormElement>,
  airlineNameRef: React.RefObject<HTMLSelectElement>,
  flightNumberRef: React.RefObject<HTMLInputElement>,
  destinationRef: React.RefObject<HTMLInputElement>,
  departureTimeRef: React.RefObject<HTMLInputElement>,
  setError: React.Dispatch<React.SetStateAction<string>>
): Promise<void> => {
  e.preventDefault();

  const airlineName: string = airlineNameRef.current?.value || '';
  const flightNumber: string = flightNumberRef.current?.value || '';
  const destination: string = destinationRef.current?.value || '';
  const departureTime: string = departureTimeRef.current?.value || '';

  if (flightNumber && !(await checkUniqueFlightNumber(flightNumber))) {
    setError('Flight number already exists!');
    return;
  }

  const storageRef = ref(storage, 'airline_image/' + airlineName + '.png');

  getDownloadURL(storageRef).then((url) => {
    addDoc(collection(db, 'departures'), {
      airline_path: url,
      departure_time: Timestamp.fromDate(new Date(departureTime)),
      destination: destination,
      flight_number: flightNumber
    }).then(() => {
      alert('Successfully uploaded new flight schedule!');
      window.location.reload();
    });
  });
};

export { fetchSchedules, handleSubmitForm };
