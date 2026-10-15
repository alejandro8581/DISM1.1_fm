import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // La ruta de tu servidor Node.js
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // ==========================================
  // MÉTODOS PARA USUARIOS
  // ==========================================
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  borrarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  // ==========================================
  // MÉTODOS PARA TRABAJOS
  // ==========================================
  getTrabajos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trabajos`);
  }

  crearTrabajo(trabajo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/trabajos`, trabajo);
  }

  actualizarTrabajo(id: number, trabajo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/trabajos/${id}`, trabajo);
  }

  borrarTrabajo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/trabajos/${id}`);
  }

  // ==========================================
  // MÉTODOS PARA FICHAJES
  // ==========================================
  // Permite pasar los filtros de fechas y usuarios que pide la App Admin
  getFichajes(filtros?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/fichajes`, { params: filtros });
  }
}