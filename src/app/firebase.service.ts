import { Injectable } from '@angular/core';
import {
  collectionData, deleteDoc, docData, Firestore,
  orderBy, updateDoc, Query, query
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

  constructor(public readonly firestore: Firestore) {
    this.tasksCollection = collection(firestore, 'tasks');
    this.sortedTasks = query(this.tasksCollection, orderBy('dueDate.timestamp', 'asc'));
    this.contactsCollection = collection(firestore, 'contacts');
    this.sortedContacts = query(this.contactsCollection, orderBy('firstName', 'asc'));
  }

  getAllTasks() {
    return collectionData(this.sortedTasks, { idField: 'id' }) as Observable<any>;
  }

  getAllContacts() {
    return collectionData(this.sortedContacts, { idField: 'id' }) as Observable<any>;
  }

  getOneTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  getOneContact(id: string) {
    const taskRef = doc(this.firestore, `contacts/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  createTask(task: any) {
    return addDoc(this.tasksCollection, task);
  }

  createContact(contact: any) {
    return addDoc(this.contactsCollection, contact);
  }

  updateTask(task: any) {
    const taskRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskRef, { ...task });
  }

  updateContact(contact: any) {
    const taskRef = doc(this.firestore, `contacts/${contact.id}`);
    return updateDoc(taskRef, { ...contact });
  }

  deleteTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskRef);
  }

  deleteContact(id: string) {
    const taskRef = doc(this.firestore, `contacts/${id}`);
    return deleteDoc(taskRef);
  }
}