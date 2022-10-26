import { Injectable } from '@angular/core';
import { collectionData, deleteDoc, docData, Firestore, orderBy, updateDoc } from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private tasksCollection: CollectionReference<DocumentData>;

  constructor(public readonly firestore: Firestore) {
    this.tasksCollection = collection(firestore, 'tasks');
  }

  getAllTasks() {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<any>;
  }

  getOneTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  createTask(task: any) {
    return addDoc(this.tasksCollection, task);
  }

  updateTask(task: any) {
    const taskRef = doc(this.firestore, `tasks/${task.id}`);
    return updateDoc(taskRef, { ...task });
  }

  deleteTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskRef);
  }
}
