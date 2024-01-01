import { Timestamp } from 'firebase/firestore';

export interface Chat {
  sender: string;
  message: string;
  created_at: Timestamp;
}
