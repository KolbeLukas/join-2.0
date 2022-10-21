import { Injectable } from '@angular/core';
import { collectionData, deleteDoc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { addDoc, collection, CollectionReference, doc, DocumentData } from '@firebase/firestore';
import { Observable } from 'rxjs';
import { Task } from 'src/models/task.class';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  task = new Task();
  private tasksCollection: CollectionReference<DocumentData>

  constructor(public readonly firestore: Firestore) {
    this.tasksCollection = collection(firestore, 'tasks');
  }

  getAllTasks() {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<Task[]>;
  }

  getOneTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return docData(taskRef, { idField: 'id' });
  }

  createTask(task: Task) {
    return addDoc(this.tasksCollection, task);
  }

  updateTask(task: Task) {
    const taskRef = doc(this.firestore, `task/${task.id}`);
    return updateDoc(taskRef, { ...task });
  }

  deleteTask(id: string) {
    const taskRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(taskRef);
  }
}
