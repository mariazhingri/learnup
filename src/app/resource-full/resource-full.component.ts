import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomePageComponent } from '../home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { LibrosResponse } from '../interfaces/libro.interface';
import { VideoModel } from '../models/video.model';
import { Observable, Subject, map } from 'rxjs';
import { ActividadModel } from '../models/actividad.model';
import { FormsModule } from '@angular/forms';
import { LibroModel } from '../models/lirbo.model';
import { ResourceActividadComponent } from '../resource-actividad/resource-actividad.component';
import { ResourceVideoComponent } from '../resource-video/resource-video.component';
import { ResouceLibroComponent } from '../resouce-libro/resouce-libro.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiService } from '../api.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ColeccionesComponent } from '../colecciones/colecciones.component';


@Component({
  selector: 'app-resource-full',
  standalone: true,
  imports: [RouterLink, HomePageComponent, ResourceActividadComponent, ResourceVideoComponent, ResouceLibroComponent, CommonModule, FormsModule,MatDialogModule],
  templateUrl: './resource-full.component.html',
  styleUrl: './resource-full.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ResourceFullComponent implements OnInit  {

  @Input() materiaId: number | undefined;
  @Input() nivel: string | undefined;
  @Input() materia: string | undefined;

  videos: VideoModel[] = [];
  libros: LibroModel[] = [];
  actividades: ActividadModel[] = [];

  sanitizedUrls: { [id: string]: SafeResourceUrl } = {}


  videosMostrados: VideoModel[] = [];
  librosMostrados: LibroModel[] = [];
  actividadesMostradas: ActividadModel[] = [];

  videosPaginados: VideoModel[] = [];
  librosPaginados: LibroModel[] = [];
  actividadesPaginados: ActividadModel[] = [];

  todosLosRecursos: any[] = [];
  todosPaginados: any[] = [];

  filtroBusqueda: string = '';

  videosPorPagina: number = 5;
  librosPorPagina: number = 5;
  actividadesPorPagina: number = 5;
  recursosPorPagina: number = 5;

  paginaActualVideos: number = 1;
  paginaActualLibros: number = 1;
  paginaActualActividades: number = 1;
  paginaActualTodos: number = 1;

  //mostrarTodosLosRecursos = false;
  mostrarTodosLosRecursos: boolean = false;
  mostrarVideo = true;
  mostrarLibro = true;
  mostrarActividad = true;

  filtroActivo: string | null = null

  backendProblem: boolean = false;
  internetProblem: boolean = false;


  mostrarTodo() {
    this.mostrarTodosLosRecursos = true;
    this.mostrarVideo = false;
    this.mostrarLibro = false;
    this.mostrarActividad = false;
    this.filtroActivo = null;
  }


  mostrarVideos() {
    this.mostrarVideo = true;
    this.mostrarLibro = false;
    this.mostrarActividad = false;
    this.mostrarTodosLosRecursos = false;
    this.filtroActivo = 'videos';
  }

  mostrarLibros() {
    this.mostrarVideo = false;
    this.mostrarLibro = true;
    this.mostrarActividad = false;
    this.mostrarTodosLosRecursos = false;
    this.filtroActivo = 'libros';
  }

  mostrarActividades() {
    this.mostrarVideo = false;
    this.mostrarLibro = false;
    this.mostrarActividad = true;
    this.mostrarTodosLosRecursos = false;
    this.filtroActivo = 'actividades';
  }

  constructor(private apiService: ApiService, private http: HttpClient, private sanitizer: DomSanitizer,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchVideos();
    this.fetchActividades();
    this.fetchLibros();
    //this.fetchObras();

    this.mostrarVideos();
    //this.mostrarTodo();
    //this.determinarMostrarTodosLosRecursos();

    // Check for backend problem
    this.apiService.getVideos().subscribe({
      next: (response: VideoModel[]) => {
        console.log('Response from API:', response);
      },
      error: (error) => {
        console.error('Error al recuperar los videos:', error.message);
        this.backendProblem = true;
      }
    });

    // Check for internet problem
    setInterval(() => {
      this.internetProblem = !navigator.onLine;
    }, 1000);

  }

  isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }


  determinarMostrarTodosLosRecursos(): void {
    this.mostrarTodosLosRecursos = this.mostrarVideo || this.mostrarLibro || this.mostrarActividad;
  }

  get numeroTotalPaginasTodos(): number {
    return Math.ceil(this.todosLosRecursos.length / this.recursosPorPagina);
  }

  get numeroTotalPaginasVideos(): number {
    return Math.ceil(this.videosMostrados.length / this.videosPorPagina);
  }

  get numeroTotalPaginasLibros(): number {
    return Math.ceil(this.librosMostrados.length / this.librosPorPagina);
  }

  get numeroTotalPaginasActividades(): number {
    return Math.ceil(this.actividadesMostradas.length / this.actividadesPorPagina);
  }

  fetchVideos(): void {
    this.apiService.getVideos().subscribe(
      (response: VideoModel[]) => {
        console.log('Response from API:', response);
        this.videos = response;
        this.sanitizeUrls();
        this.videosMostrados = this.videos;
        this.actualizarVideosPaginados();
      },
      error => {
        if (!error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.error('Error al recuperar los videos:', error.message);
        }
      }
    );
  }

  sanitizeUrls() {
    this.videos.forEach(video => {
      this.sanitizedUrls[video.video_id] = this.sanitizer.bypassSecurityTrustResourceUrl(video.url);
    });
  }

  getSafeUrl(videoId: number): SafeResourceUrl | undefined {
    return this.sanitizedUrls[videoId];
  }

  isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  isMp4Url(url: string): boolean {
    return url.endsWith('.mp4');
  }

  getFullVideoUrl(url: string): string {
    return `http://localhost:3000${url}`;
  }

  handleLinkClickVideo(event: Event, url: string) {
    if (this.isMp4Url(url)) {
      event.preventDefault();
      this.downloadVideo(this.getFullVideoUrl(url), this.getFileNameVideo(url));
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  downloadVideo(url: string, filename: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error al descargar el archivo:', error));
  }

  getFileNameVideo(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'video.mp4';
  }

  getDownloadUrlVideo(url: string): string {
    return this.getFullVideoUrl(url);
  }



  fetchLibros(): void {
    this.apiService.getLibros().subscribe(
      (response: LibroModel[]) => {
        console.log('Response from API:', response);
        this.libros = response;
        this.librosMostrados = this.libros;
        this.actualizarLibrosPaginados();
        this.librosPaginados = this.libros.slice(0, this.librosPorPagina);
      },
      error => {
        if (!error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.error('Error al recuperar los libros:', error.message);
        }
      }
    );
  }

  isLocalImageLibro(url: string): boolean {
    return url.startsWith('/uploads/libros/imagenes/');
  }

  isExternalImageLibro(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  isPdfLibro(url: string): boolean {
    return url.endsWith('.pdf');
  }

  getFullImageUrlLibro(url: string): string {
    return this.isLocalImageLibro(url) ? `http://localhost:3000${url}` : url;
  }

  getFullPdfUrlLibro(url: string): string {
    return `http://localhost:3000${url}`;
  }

  handleLinkClickLibro(event: Event, url: string) {
    if (this.isPdfLibro(url)) {
      event.preventDefault();
      this.downloadLibro(this.getFullPdfUrlLibro(url), this.getFileNameLibro(url));
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  downloadLibro(url: string, filename: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error al descargar el archivo:', error));
  }

  getFileNameLibro(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'libro.pdf';
  }

  getDownloadUrlLibro(url: string): string {
    return this.getFullPdfUrlLibro(url);
  }




  fetchActividades(): void {
    this.apiService.getActividades().subscribe(
      (response: ActividadModel[]) => {
        console.log('Response from API:', response);
        this.actividades = response;
        this.actividadesMostradas = this.actividades;
        this.actualizarActividadesPaginadas();
        this.actividadesPaginados = this.actividades.slice(0, this.actividadesPorPagina);
        //this.numeroTotalPaginasActividades = Math.ceil(this.actividades.length / this.actividadesPorPagina); // Total de páginas
      },
      error => {
        if (!error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          console.error('Error al recuperar las actividades:', error.message);
        }
      }
    );
  }

  isLocalImageActividad(url: string): boolean {
    return url.startsWith('/uploads/actividades/imagenes/');
  }

  isExternalImageActividad(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  isPdfActividad(url: string): boolean {
    return url.endsWith('.pdf');
  }

  getFullImageUrlActividad(url: string): string {
    return this.isLocalImageActividad(url) ? `http://localhost:3000${url}` : url;
  }

  getFullPdfUrlActividad(url: string): string {
    return `http://localhost:3000${url}`;
  }

  handleLinkClickActividad(event: Event, url: string) {
    if (this.isPdfActividad(url)) {
      event.preventDefault();
      this.downloadActividad(this.getFullPdfUrlActividad(url), this.getFileNameActividad(url));
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  downloadActividad(url: string, filename: string) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => console.error('Error al descargar el archivo:', error));
  }

  getFileNameActividad(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] || 'actividad.pdf';
  }

  getDownloadUrlActividad(url: string): string {
    return this.getFullPdfUrlActividad(url);
  }




  /*private fetchObras(): void {
    this.http.get<LibrosResponse>('https://openlibrary.org/people/mekBot/books/want-to-read.json')
      .subscribe(
        response => {
          this.libros = response.reading_log_entries.map(entry => ({
            titulo: entry.work.title,
            autores: entry.work.author_names.join(', '),
            fecha_publicacion: entry.work.first_publish_year,
            fecha_registro: entry.logged_date,
            url_cubierta: entry.work.cover_id ? `https://covers.openlibrary.org/b/id/${entry.work.cover_id}-L.jpg` : null
          }));
          this.librosMostrados = this.libros;
          this.actualizarLibrosPaginados();
        },
        error => {
          console.error('Error al recuperar los libros:', error);
        }
      );
  }*/

  filtrarRecursos(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();

    if (filtro === '') {
      this.restablecerRecursos();
    } else {
      this.videosMostrados = this.filtrarPorTituloYDescripcion(this.videos, filtro);
      this.actividadesMostradas = this.filtrarPorTituloYDescripcion(this.actividades, filtro);
      this.librosMostrados = this.filtrarPorTituloYDescripcion(this.libros, filtro);
    }

    this.paginaActualVideos = 1;
    this.paginaActualLibros = 1;
    this.paginaActualActividades = 1;
    this.paginaActualTodos = 1;

    this.actualizarVideosPaginados();
    this.actualizarLibrosPaginados();
    this.actualizarActividadesPaginadas();
    this.actualizarTodosPaginados();
  }

  private filtrarPorTituloYDescripcion(recursos: any[], filtro: string): any[] {
    return recursos.filter(recurso => {
      const titulo = recurso.titulo ? recurso.titulo.toLowerCase() : '';
      const autor = recurso.autor ? recurso.autor.toLowerCase() : '';
      const descripcion = recurso.descripcion ? recurso.descripcion.toLowerCase() : '';
      return titulo.includes(filtro)  || descripcion.includes(filtro) || autor.includes(filtro);
      //return titulo.includes(filtro) || descripcion.includes(filtro);
      //return titulo.includes(filtro) || autor.includes(filtro);
    });
  }

  private actualizarVideosPaginados() {
    const startIndex = (this.paginaActualVideos - 1) * this.videosPorPagina;
    this.videosPaginados = this.videosMostrados.slice(startIndex, startIndex + this.videosPorPagina);
  }

  private actualizarLibrosPaginados() {
    const startIndex = (this.paginaActualLibros - 1) * this.librosPorPagina;
    this.librosPaginados = this.librosMostrados.slice(startIndex, startIndex + this.librosPorPagina);
  }

  private actualizarActividadesPaginadas() {
    const startIndex = (this.paginaActualActividades - 1) * this.actividadesPorPagina;
    this.actividadesPaginados = this.actividadesMostradas.slice(startIndex, startIndex + this.actividadesPorPagina);
  }

  actualizarTodosPaginados() {
    const startIndex = (this.paginaActualTodos - 1) * this.recursosPorPagina;
    this.todosPaginados = this.todosLosRecursos.slice(startIndex, startIndex + this.recursosPorPagina);
  }

  paginaAnteriorVideos() {
    if (this.paginaActualVideos > 1) {
      this.paginaActualVideos--;
      this.actualizarVideosPaginados();
    }
  }

  paginaSiguienteVideos() {
    if (this.paginaActualVideos * this.videosPorPagina < this.videosMostrados.length) {
      this.paginaActualVideos++;
      this.actualizarVideosPaginados();
    }
  }

  irPrimeraPaginaVideos() {
    this.paginaActualVideos = 1;
    this.actualizarVideosPaginados();
  }

  irUltimaPaginaVideos() {
    this.paginaActualVideos = this.numeroTotalPaginasVideos;
    this.actualizarVideosPaginados();
  }

  paginaAnteriorLibros() {
    if (this.paginaActualLibros > 1) {
      this.paginaActualLibros--;
      this.actualizarLibrosPaginados();
    }
  }

  paginaSiguienteLibros() {
    if (this.paginaActualLibros * this.librosPorPagina < this.librosMostrados.length) {
      this.paginaActualLibros++;
      this.actualizarLibrosPaginados();
    }
  }

  irPrimeraPaginaLibros() {
    this.paginaActualLibros = 1;
    this.actualizarLibrosPaginados();
  }

  irUltimaPaginaLibros() {
    this.paginaActualLibros = this.numeroTotalPaginasLibros;
    this.actualizarLibrosPaginados();
  }

  paginaAnteriorActividades() {
    if (this.paginaActualActividades > 1) {
      this.paginaActualActividades--;
      this.actualizarActividadesPaginadas();
    }
  }

  paginaSiguienteActividades() {
    if (this.paginaActualActividades * this.actividadesPorPagina < this.actividadesMostradas.length) {
      this.paginaActualActividades++;
      this.actualizarActividadesPaginadas();
    }
  }

  irPrimeraPaginaActividades() {
    this.paginaActualActividades = 1;
    this.actualizarActividadesPaginadas();
  }

  irUltimaPaginaActividades() {
    this.paginaActualActividades = this.numeroTotalPaginasActividades;
    this.actualizarActividadesPaginadas();
  }

  paginaAnteriorTodos() {
    if (this.paginaActualTodos > 1) {
      this.paginaActualTodos--;
      this.actualizarTodosPaginados();
    }
  }

  paginaSiguienteTodos() {
    if (this.paginaActualTodos < this.numeroTotalPaginasTodos) {
      this.paginaActualTodos++;
      this.actualizarTodosPaginados();
    }
  }

  irPrimeraPaginaTodos() {
    this.paginaActualTodos = 1;
    this.actualizarTodosPaginados();
  }

  irUltimaPaginaTodos() {
    this.paginaActualTodos = this.numeroTotalPaginasTodos;
    this.actualizarTodosPaginados();
  }

  restablecerRecursos(): void {
    this.videosMostrados = this.videos.slice();
    this.actividadesMostradas = this.actividades.slice();
    this.librosMostrados = this.libros.slice();
    this.actualizarVideosPaginados();
    this.actualizarLibrosPaginados();
    this.actualizarActividadesPaginadas();
  }


  scrollToTop(): void {
    //window.scrollTo({ top: 50, behavior: 'smooth' });
    const offset = -138; // más hacia arriba
    const halfWindowHeight = window.innerHeight / 2;
    const scrollToPosition = halfWindowHeight + offset;
    window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
  }

  openDialog(event: Event, recurso: any) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ColeccionesComponent, {
      data: { recurso }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
