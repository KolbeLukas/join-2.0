import { Injectable } from '@angular/core';
import {
  collectionData, deleteDoc, docData, Firestore,
  orderBy, updateDoc, Query, query, limit, setDoc
} from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private tasksCollection: CollectionReference<DocumentData>;
  private sortedTasks: Query<DocumentData>;
  private contactsCollection: CollectionReference<DocumentData>;
  private sortedContacts: Query<DocumentData>;
  private usersCollection: CollectionReference<DocumentData>;

  constructor(public readonly firestore: Firestore) {
    this.tasksCollection = collection(firestore, 'tasks');
    this.sortedTasks = query(this.tasksCollection, orderBy('dueDate.timestamp', 'asc'));
    this.contactsCollection = collection(firestore, 'contacts');
    this.sortedContacts = query(this.contactsCollection, orderBy('firstName', 'asc'));
    this.usersCollection = collection(firestore, 'users');
  }

  getAllTasks() {
    return collectionData(this.sortedTasks, { idField: 'id' }) as Observable<any>;
  }

  getAllContacts() {
    return collectionData(this.sortedContacts, { idField: 'id' }) as Observable<any>;
  }

  getOneContact(id: string) {
    const taskRef = doc(this.firestore, `contacts/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  getOneUser(id: string) {
    const taskRef = doc(this.firestore, `users/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  createTask(task: any) {
    return addDoc(this.tasksCollection, task);
  }

  createContact(contact: any) {
    return addDoc(this.contactsCollection, contact);
  }

  createUser(user: any, id: any) {
    return setDoc(doc(this.usersCollection, id), user);
  }

  updateTask(task: any) {
    const docRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(docRef, { ...task });
  }

  updateContact(contact: any) {
    const docRef = doc(this.firestore, `contacts/${contact.id}`);
    return updateDoc(docRef, { ...contact });
  }

  updateUser(user: any) {
    const docRef = doc(this.firestore, `users/${user.uid}`);
    return updateDoc(docRef, { emailVerified: user.emailVerified });
  }

  deleteTask(id: string) {
    const docRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(docRef);
  }

  deleteContact(id: string) {
    const docRef = doc(this.firestore, `contacts/${id}`);
    return deleteDoc(docRef);
  }

  findContactID() {
    const q = query(this.contactsCollection, orderBy('addDate', 'desc'), limit(1));
    return collectionData(q, { idField: 'id' }) as Observable<any>;
  }
}