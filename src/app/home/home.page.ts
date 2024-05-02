import { Component, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel, IonItem, IonList, IonIcon, IonInput,
  IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular/standalone';
import { Task } from '../interfaces/models/task.model';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ NgFor,NgClass, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonLabel, 
    IonItem, IonList, IonIcon, IonIcon, IonItemSliding, IonItemOptions, IonItemOption
  ],
})
export class HomePage {

  tasks: Array<Task> = [
    {
      title: 'Task 1',
      description: 'This is a sample task',
      status: 'open'
    }, {
      title: 'Task 2',
      description: 'This is a sample task',
      status: 'open'
    }, {
      title: 'Task 3',
      description: 'This is a sample task',
      status: 'open'
    }
  ]

  @ViewChild(IonModal) modal: IonModal | undefined;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name = 'World';

  constructor() { }

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
    this.modal?.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
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

  //TODO: Agregar un componente cualquiera para mejorar la app que llevamos, un modal,un toggle, select, etc.

}
