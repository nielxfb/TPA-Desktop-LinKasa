import {
  DocumentReference,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../../firebase/firebase';
import { queryFromCollection } from './Utils';
import { Item } from '@renderer/model/Item';

const handleStatusChange = (selectedStatus, setSelectedStatus, status: string): void => {
  if (selectedStatus === status) setSelectedStatus('');
  else if (selectedStatus != status) setSelectedStatus(status);
};

const handleNewItem = (e, setIsModalOpen): void => {
  e.preventDefault();

  setIsModalOpen(true);
};

const closeModal = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedStatus: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  nameRef: React.RefObject<HTMLInputElement>,
  descriptionRef: React.RefObject<HTMLInputElement>,
  imageRef: React.RefObject<HTMLInputElement>
): void => {
  setIsModalOpen(false);

  if (!selectedStatus) {
    setError('Please set item status!');
    return;
  } else {
    setError('');
  }

  const name = nameRef.current?.value;
  const description = descriptionRef.current?.value;
  const image = imageRef.current?.files?.[0];

  if (image) {
    const storageRef = ref(storage, 'images/' + image.name);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        const itemsRef = collection(db, 'items');

        addDoc(itemsRef, {
          description: description,
          found_at: Timestamp.fromDate(new Date()),
          image_url: url,
          name: name,
          status: selectedStatus
        }).then(() => {
          alert('Successfully uploaded new lost item!');
          window.location.reload();
        });
      });
    });
  }
};

const handleRemoveItem = async (itemName: string): Promise<void> => {
  const q = queryFromCollection('items', 'name', itemName);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const url = userData.image_url;
    if (url) {
      const storageRef = ref(storage, url);
      deleteObject(storageRef).then(() => {
        deleteDoc(doc.ref).then(() => {
          alert('Item removed successfully.');
          window.location.reload();
        });
      });
    }
  });
};

const handleEditStatus = async (
  selectedStatus: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedItemName: string,
  nameRef: React.RefObject<HTMLInputElement>,
  descriptionRef: React.RefObject<HTMLInputElement>,
  imageRef: React.RefObject<HTMLInputElement>
): Promise<void> => {
  if (selectedStatus === '') {
    setError('Please set item status!');
    setIsModalOpen(false);
    return;
  } else {
    setError('');
  }

  const q = queryFromCollection('items', 'name', selectedItemName);
  const querySnapshot = await getDocs(q);
  let docRef: DocumentReference | undefined;

  querySnapshot.forEach((doc) => {
    docRef = doc.ref;
  });

  const name = nameRef.current?.value;
  const description = descriptionRef.current?.value;
  const image = imageRef.current?.files?.[0];

  if (image) {
    const storageRef = ref(storage, 'images/' + image.name);
    uploadBytes(storageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        if (docRef) {
          updateDoc(docRef, {
            description: description,
            image_url: url,
            name: name,
            status: selectedStatus
          }).then(() => {
            alert('Successfully updated item!');
            window.location.reload();
          });
        } else {
          alert('Error updating item.');
        }
      });
    });
  } else {
    alert('No image selected.');
  }
};

const useOpenModal = (setSelectedItemName, setIsModalOpen, itemName: string): void => {
  setSelectedItemName(itemName);
  setIsModalOpen(true);
};

const fetchLostItems = async (): Promise<Item[]> => {
  const q = collection(db, 'items');
  const querySnapshot = await getDocs(q);
  const items: Item[] = [];
  querySnapshot.forEach((doc) => {
    items.push(doc.data() as Item);
  });

  return items;
};

export {
  handleStatusChange,
  handleNewItem,
  closeModal,
  handleRemoveItem,
  handleEditStatus,
  useOpenModal,
  fetchLostItems
};
