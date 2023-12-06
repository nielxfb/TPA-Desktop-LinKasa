import { Timestamp } from 'firebase/firestore';

export interface Schedule {
  airline_path: string;
  departure_time: Timestamp;
  destination: string;
  flight_number: string;
}
