import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { Schedule } from '@renderer/model/Schedule';

const fetchSchedules = async (): Promise<Schedule[]> => {
  const q = collection(db, 'departures');
  const querySnapshot = await getDocs(q);
  const departures: Schedule[] = [];
  querySnapshot.forEach((doc) => {
    const departureData = doc.data() as Schedule;
    departures.push(departureData);
  });

  return departures;
};

export { fetchSchedules };
