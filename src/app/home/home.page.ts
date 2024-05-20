import { Component, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel, IonItem, IonList, IonIcon, IonInput,
  IonItemSliding, IonItemOptions, IonItemOption, IonModal, IonRefresherContent, IonRefresher,
} from '@ionic/angular/standalone';
import { Task } from '../interfaces/models/task.model';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
// import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { add } from 'ionicons/icons';
import { checkmark } from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

import { Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, update, remove, onValue, push, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyALxmN1HbJuJpok77pIchzNL4q1MALNrWg",
  authDomain: "mfcaicedo-afd34.firebaseapp.com",
  projectId: "mfcaicedo-afd34",
  storageBucket: "mfcaicedo-afd34.appspot.com",
  messagingSenderId: "621929313026",
  appId: "1:621929313026:web:f569d63a99c18799c7081b",
  measurementId: "G-LS17PB5ZT8"
};

const app = initializeApp(firebaseConfig);

/**
 * Conexión a la base de datos de Firebase
 * Tarea: mejorar 
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [NgFor, NgClass, IonModal, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel,
    IonItem, IonList, IonIcon, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, FormsModule, IonRefresher, IonRefresherContent
  ],
})
export class HomePage {

  count: number = 0;
  tasks: Task[] = []

  @ViewChild(IonModal) modal!: IonModal;

  taskTitle = '';

  theNewTask: string | null = "";
  app = initializeApp(firebaseConfig);
  db = getDatabase(this.app);

  constructor() {
    // addIcons({ trash, add, checkmark });

  }

  ngOnInit() {

    const dbRef = ref(this.db, 'tasks');
    // onValue(dbRef, (snapshot) => {
    //   const data = snapshot.val();
    //   // console.log("ver data: ", data);
    //   // this.tasks = [];
    //   for (const key in data) {
    //     if (data.hasOwnProperty(key)) {
    //       const element = data[key];
    //       this.tasks.push({
    //         key: key,
    //         title: element.title,
    //         description: element.description,
    //         status: element.status
    //       });
    //     }
    //   }
    // });
    
    // Manejar la adición de nuevos elementos
    onChildAdded(dbRef, (snapshot) => {
      console.log("onChildAdded: ");
      const data = snapshot.val();
      this.tasks.push({ key: snapshot.key, ...data });
    });

    // Manejar cambios en los elementos existentes
    onChildChanged(dbRef, (snapshot) => {
      console.log("in onChildChanged: ");
      const data = snapshot.val();
      const index = this.tasks.findIndex(task => task.key === snapshot.key);
      if (index !== -1) {
        this.tasks[index] = { key: snapshot.key, ...data };
      }
    });

    // Manejar la eliminación de elementos
    onChildRemoved(dbRef, (snapshot) => {
      console.log("onChildRemoved: ");
      const index = this.tasks.findIndex(task => task.key === snapshot.key);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    });

  }

  onChildChanged() {
    const dbRef = ref(this.db, 'tasks');
    onChildChanged(dbRef, (snapshot) => {
      const data = snapshot.val();
      console.log("ver data: ", data);
    });
  }

  addTask() {

    // let newTask = prompt('Nueva tarea', '');
    // if (newTask !== null && newTask !== '') {
    //   this.tasks.push({
    //     title: newTask,
    //     description: 'This is a sample task',
    //     status: 'open'
    //   });
    // }
    if (this.theNewTask !== '') {
      // this.count++;
      console.log("ver el valor de theNewTask: ", this.theNewTask);
      const dbRef = ref(this.db, 'tasks');
      const newTask = push(dbRef);
      set(newTask, {
        title: this.theNewTask,
        description: 'This is a sample task',
        status: 'open'
      });

    }

  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {

    this.modal?.dismiss(this.taskTitle, 'confirm');

    if (this.taskTitle !== '') {

      const dbRef = ref(this.db, 'tasks');
      const newTask = push(dbRef);
      set(newTask, {
        title: this.taskTitle,
        description: 'This is a sample task',
        status: 'open'
      });
      this.taskTitle = '';
    }

  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      // this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  markAsDone(task: Task, slidingItem: IonItemSliding) {
    task.status = 'done';
    setTimeout(() => {
      slidingItem.close();
    }, 100);
  }

  deleteTask(task: Task, slidingItem: IonItemSliding) {

    this.tasks = this.tasks.filter(t => t !== task);
    setTimeout(() => {
      slidingItem.close();
    }, 100);
  }

}
