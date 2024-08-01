import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { environment } from '../../environments/environment.development';
import { VideoModel } from '../models/video.model';
import { ActividadModel } from '../models/actividad.model';

@Injectable({
  providedIn: 'root'
})

export class VideosService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(environment.baseUrl);
  }

  async getVideos(): Promise<VideoModel[]> {
    try {
      const records = await this.pb.collection('recurso_video').getFullList<VideoModel>({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  async getActividades(): Promise<ActividadModel[]> {
    try {
      const records = await this.pb.collection('recurso_actividad').getFullList<ActividadModel>({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching actividades:', error);
      throw error;
    }
  }

}
