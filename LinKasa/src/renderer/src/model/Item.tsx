import { Timestamp } from 'firebase/firestore';

export interface Item {
  description: string;
  found_at: Timestamp;
  image_url: string;
  name: string;
  status: string;
}
