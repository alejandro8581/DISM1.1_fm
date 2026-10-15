import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonSearchbar, IonInput 
} from '@ionic/angular';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-gestion-fichajes',
  templateUrl: './gestion-fichajes.page.html',
  styleUrls: ['./gestion-fichajes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
    IonContent, IonList, IonItem, IonLabel, IonButton, IonIcon,
    IonSearchbar, IonInput
  ]
})
export class GestionFichajesPage implements OnInit {
  fichajes: any[] = [];
  filtroUsuario: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.cargarFichajes();
  }

  cargarFichajes() {
    // Construimos el objeto de filtros solo con los campos que tengan valor
    const filtros: any = {};
    if (this.filtroUsuario) filtros.idUsuario = this.filtroUsuario;
    if (this.filtroFechaInicio) filtros.fechaInicio = this.filtroFechaInicio;
    if (this.filtroFechaFin) filtros.fechaFin = this.filtroFechaFin;

    this.api.getFichajes(filtros).subscribe({
      next: (data) => this.fichajes = data,
      error: (err) => console.error('Error al cargar fichajes:', err)
    });
  }

  verMapa(lat: number, lng: number) {
    if (lat && lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    } else {
      alert('Este fichaje no tiene coordenadas de geolocalización guardadas.');
    }
  }
}