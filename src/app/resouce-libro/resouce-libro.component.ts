import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LibroModel } from '../models/lirbo.model';
import { RouterLink } from '@angular/router';
import { ResourceMenuComponent } from '../resource-menu/resource-menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { ColeccionesComponent } from '../colecciones/colecciones.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-resouce-libro',
  standalone: true,
  imports: [RouterLink, ResouceLibroComponent, ResourceMenuComponent, CommonModule, FormsModule, MatDialogModule],
  templateUrl: './resouce-libro.component.html',
  styleUrls: ['./resouce-libro.component.css']
})

export class ResouceLibroComponent implements OnInit {

  @Output() nivelLoaded: EventEmitter<string> = new EventEmitter<string>();
  @Input() mostrarLibros: boolean = false;
  @Input() materiaId: number | undefined;
  @Input() nivel: string | undefined;
  @Input() materia: string | undefined;

  libros: LibroModel[] = [];
  librosMostrados: LibroModel[] = [];
  librosPaginados: LibroModel[] = [];
  filtroBusqueda: string = '';
  sanitizedUrls: { [key: string]: SafeResourceUrl } = {};

  librosPorPagina: number = 5;
  paginaActualLibros: number = 1;

  backendProblem: boolean = false;
  internetProblem: boolean = false;

  constructor(private apiService: ApiService, private http: HttpClient, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  isLoggedIn(): boolean {
    return this.apiService.isLoggedIn();
  }

  ngOnInit(): void {
    this.fetchLibros();

    // Check for backend problem
    this.apiService.getLibros().subscribe({
      next: (response: LibroModel[]) => {
        console.log('Response from API:', response);
      },
      error: (error) => {
        console.error('Error al recuperar los actividades:', error.message);
        this.backendProblem = true;
      }
    });

    // Check for internet problem
    setInterval(() => {
      this.internetProblem = !navigator.onLine;
    }, 1000);

  }

  fetchLibros(): void {
    this.apiService.getLibros().subscribe(
      (response: LibroModel[]) => {
        console.log('Response from API:', response);
        this.libros = response.filter(libro => libro.materia_id === this.materiaId);
        this.librosMostrados = this.libros;
        this.actualizarLibrosPaginados();
        if (this.libros.length === 0) {
          console.log('No se encontraron libros para este materia_id.');
        } else {
          const firstLibro = this.libros[0];
          this.nivel = firstLibro.nivel;
          this.materia = firstLibro.materia;
        }
      },
      error => {
        console.error('Error al recuperar los libros:', error.message);
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

  scrollToTop(): void {
    //window.scrollTo({ top: 50, behavior: 'smooth' });
    const offset = 290;
    const halfWindowHeight = window.innerHeight / 2;
    const scrollToPosition = halfWindowHeight + offset;
    window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
  }

  filtrarRecursos(): void {
    const filtro = this.filtroBusqueda.trim().toLowerCase();

    if (filtro === '') {
      this.restablecerRecursos();
    } else {
      this.librosMostrados = this.filtrarPorTituloYDescripcion(this.libros, filtro);
      this.actualizarLibrosPaginados();
    }

    this.paginaActualLibros = 1;
  }

  private filtrarPorTituloYDescripcion(recursos: any[], filtro: string): any[] {
    return recursos.filter(recurso => {
      const titulo = recurso.titulo ? recurso.titulo.toLowerCase() : '';
      const descripcion = recurso.descripcion ? recurso.descripcion.toLowerCase() : '';
      const autor = recurso.autor ? recurso.autor.toLowerCase() : '';
      return titulo.includes(filtro) || descripcion.includes(filtro) || autor.includes(filtro);
      //return titulo.includes(filtro) || autor.includes(filtro);
    });
  }

  private actualizarLibrosPaginados() {
    const startIndex = (this.paginaActualLibros - 1) * this.librosPorPagina;
    this.librosPaginados = this.librosMostrados.slice(startIndex, startIndex + this.librosPorPagina);
  }

  get numeroTotalPaginasLibros(): number {
    return Math.ceil(this.librosMostrados.length / this.librosPorPagina);
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

  restablecerRecursos(): void {
    this.librosMostrados = this.libros.slice();
    this.actualizarLibrosPaginados();
  }

  openDialog(event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(ColeccionesComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
