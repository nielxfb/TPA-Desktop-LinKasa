import { Timestamp } from 'firebase/firestore';
import { Response } from '@renderer/model/Response';

export interface Feedback {
  name: string;
  description: string;
  created_at: Timestamp;
  response: Response[];
}
