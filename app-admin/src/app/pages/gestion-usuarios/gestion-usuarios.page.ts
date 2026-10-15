import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.page.html',
  styleUrls: ['./gestion-usuarios.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GestionUsuariosPage implements OnInit {
  usuarios: any[] = [];

  constructor(private api: ApiService, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.api.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  async mostrarFormulario(usuario?: any) {
    const alert = await this.alertCtrl.create({
      header: usuario ? 'Editar Usuario' : 'Nuevo Usuario',
      inputs: [
        { name: 'IdUsuario', type: 'number', placeholder: 'ID (Ej: 1)', value: usuario?.IdUsuario },
        { name: 'Nombre', type: 'text', placeholder: 'Nombre Completo', value: usuario?.Nombre },
        { name: 'Usuario', type: 'text', placeholder: 'Nombre de usuario', value: usuario?.Usuario },
        { name: 'Clave', type: 'text', placeholder: 'Contraseña', value: usuario?.Clave }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (usuario) {
              this.api.actualizarUsuario(usuario.IdUsuario, data).subscribe(() => this.cargarUsuarios());
            } else {
              this.api.crearUsuario(data).subscribe(() => this.cargarUsuarios());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  borrarUsuario(id: number) {
    this.api.borrarUsuario(id).subscribe(() => this.cargarUsuarios());
  }
}