import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


// =========================
// INTERFACES
// =========================

export interface Area {

  _id: string;

  nombre: string;

  descripcion: string;

  icono: string;

  activa: boolean;

  orden: number;

  mentoras?: number;

  createdAt: string;

  updatedAt: string;

}

export interface AreaResponse {

  success: boolean;

  count: number;

  data: Area[];

}

export interface SingleAreaResponse {

  success: boolean;

  data: Area;

  message?: string;

}

export interface DeleteAreaResponse {

  success: boolean;

  message: string;

}

export interface CreateAreaData {

  nombre: string;

  descripcion: string;

  icono?: string;

  orden?: number;

}


// =========================
// SERVICE
// =========================

@Injectable({
  providedIn: 'root'
})

export class AreaService {

  private apiUrl =
    `${environment.apiUrl}/areas`;

  constructor(
    private http: HttpClient
  ) {}


  // =========================
  // OBTENER ÁREAS
  // =========================

  getAreas(
    activaOnly: boolean = true
  ): Observable<AreaResponse> {

    let params = new HttpParams();

    if (activaOnly) {

      params =
        params.set('activa', 'true');

    }

    return this.http.get<AreaResponse>(
      this.apiUrl,
      { params }
    );

  }


  // =========================
  // OBTENER ÁREA POR ID
  // =========================

  getAreaById(
    id: string
  ): Observable<SingleAreaResponse> {

    return this.http.get<SingleAreaResponse>(
      `${this.apiUrl}/${id}`
    );

  }


  // =========================
  // CREAR ÁREA
  // =========================

  createArea(
    data: CreateAreaData
  ): Observable<SingleAreaResponse> {

    return this.http.post<SingleAreaResponse>(
      this.apiUrl,
      data
    );

  }


  // =========================
  // ACTUALIZAR ÁREA
  // =========================

  updateArea(
    id: string,
    data: Partial<CreateAreaData>
  ): Observable<SingleAreaResponse> {

    return this.http.put<SingleAreaResponse>(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // =========================
  // ELIMINAR ÁREA
  // =========================

  deleteArea(
    id: string
  ): Observable<DeleteAreaResponse> {

    return this.http.delete<DeleteAreaResponse>(
      `${this.apiUrl}/${id}`
    );

  }

}