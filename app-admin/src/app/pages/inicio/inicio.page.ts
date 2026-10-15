import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { peopleOutline, briefcaseOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon
  ]
})
export class InicioPage implements OnInit {

  constructor() {
    // En Standalone Components es necesario registrar los iconos que se van a usar
    addIcons({ peopleOutline, briefcaseOutline, timeOutline });
  }

  ngOnInit() {
  }
}