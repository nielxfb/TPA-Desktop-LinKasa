import { Timestamp } from 'firebase/firestore';

export interface User {
  name: string;
  email: string;
  role: string;
  password: string;
  dob: Timestamp;
  address: string;
}
