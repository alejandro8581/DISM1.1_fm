import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonList, IonItem, IonLabel, IonButton, IonFab, 
  IonFabButton, IonIcon 
} from '@ionic/angular';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-gestion-trabajos',
  templateUrl: './gestion-trabajos.page.html',
  styleUrls: ['./gestion-trabajos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonList, IonItem, IonLabel, IonButton, IonFab, 
    IonFabButton, IonIcon
  ]
})
export class GestionTrabajosPage implements OnInit {
  trabajos: any[] = [];

  constructor(private api: ApiService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.cargarTrabajos();
  }

  cargarTrabajos() {
    this.api.getTrabajos().subscribe({
      next: (data) => this.trabajos = data,
      error: (err) => console.error('Error al cargar trabajos:', err)
    });
  }

  async mostrarFormulario(trabajo?: any) {
    const alert = await this.alertCtrl.create({
      header: trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo',
      inputs: [
        { name: 'IdTrabajo', type: 'number', placeholder: 'ID (Ej: 1)', value: trabajo?.IdTrabajo },
        { name: 'Nombre', type: 'text', placeholder: 'Nombre del trabajo', value: trabajo?.Nombre }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (trabajo) {
              this.api.actualizarTrabajo(trabajo.IdTrabajo, data).subscribe(() => this.cargarTrabajos());
            } else {
              this.api.crearTrabajo(data).subscribe(() => this.cargarTrabajos());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  borrarTrabajo(id: number) {
    this.api.borrarTrabajo(id).subscribe(() => this.cargarTrabajos());
  }
}