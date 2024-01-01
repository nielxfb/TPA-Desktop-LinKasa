import { Timestamp } from 'firebase/firestore';

export interface Response {
  sender: string;
  response: string;
  created_at: Timestamp;
}
