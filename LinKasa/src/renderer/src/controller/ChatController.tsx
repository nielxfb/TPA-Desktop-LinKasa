import {
  CollectionReference,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from './../../../firebase/firebase';
import { Chat } from '@renderer/model/Chat';

const fetchChats = async (currChat: string, department: string, role: string): Promise<Chat[]> => {
  let chatsRef: CollectionReference | undefined;

  const receiverRole = role.replace(/\s+/g, '_').toLowerCase();

  if (currChat === 'global') {
    chatsRef = collection(db, 'global_chat');
  } else if (currChat === 'department') {
    chatsRef = collection(db, 'department_chat_' + department);
  } else if (currChat === 'private') {
    chatsRef = collection(db, 'internal_chat_maintenance');
  } else if (currChat === 'mydept') {
    chatsRef = collection(db, 'department_chat_' + receiverRole);
  }

  if (chatsRef === undefined) return [];
  const q = query(chatsRef, orderBy('created_at'));
  const chats: Chat[] = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    chats.push(doc.data() as Chat);
  });

  return chats;
};

const sendMessage = (
  message: string,
  sender: string,
  currChat: string,
  department: string
): void => {
  const toSend = message.trim();
  let chatsRef: CollectionReference | undefined;
  if (currChat === 'global') {
    chatsRef = collection(db, 'global_chat');
  } else if (currChat === 'department') {
    chatsRef = collection(db, 'department_chat_' + department);
  } else if (currChat === 'private') {
    chatsRef = collection(db, 'internal_chat_maintenance');
  }
  if (toSend === '' || chatsRef === undefined) return;
  addDoc(chatsRef, {
    sender: sender,
    message: toSend,
    created_at: new Date()
  });
};

export { fetchChats, sendMessage };
