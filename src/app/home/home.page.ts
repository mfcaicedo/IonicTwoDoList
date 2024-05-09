import { Component, ViewChild } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel, IonItem, IonList, IonIcon, IonInput,
  IonItemSliding, IonItemOptions, IonItemOption, IonModal,
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

/**
 * Tarea: Agregar un Componente de Ionic 
 * Solución: 
 * 1- Se agrega el componente IonModal y se utilizó para crear una nueva tarea que se agrega a la lista 
 * de tareas. 
 * 2- Se soluciona el error en los iconos de la lista de tareas, se importa la función addIcons de ionicons
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [NgFor, NgClass, IonModal, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel,
    IonItem, IonList, IonIcon, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, FormsModule
  ],
})
export class HomePage {

  tasks: Array<Task> = [
    {
      title: 'Tarea 1',
      description: 'This is a sample task',
      status: 'open'
    }, {
      title: 'Tarea 2',
      description: 'This is a sample task',
      status: 'open'
    }, {
      title: 'Tarea 3',
      description: 'This is a sample task',
      status: 'open'
    }
  ]

  @ViewChild(IonModal) modal!: IonModal;

  taskTitle = '';

  constructor() {
    addIcons({ trash, add, checkmark });
  }

  addTask() {
    let newTask = prompt('Nueva tarea', '');
    if (newTask !== null && newTask !== '') {
      this.tasks.push({
        title: newTask,
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
      this.tasks.push({
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
