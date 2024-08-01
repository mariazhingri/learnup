import { Paginable } from "../interfaces/pagina.interface";

export class RecursosPaginados {

  videos: any[] = [];
  libros: any[] = [];
  actividades: any[] = [];

  videosPorPagina: number = 5;
  librosPorPagina: number = 5;
  actividadesPorPagina: number = 5;

  paginaActualVideos: number = 1;
  paginaActualLibros: number = 1;
  paginaActualActividades: number = 1;

  paginaAnteriorVideos(): void {
    if (this.paginaActualVideos > 1) {
      this.paginaActualVideos--;
    }
  }

  paginaSiguienteVideos(): void {
    const numeroTotalPaginas = Math.ceil(this.videos.length / this.videosPorPagina);
    if (this.paginaActualVideos < numeroTotalPaginas) {
      this.paginaActualVideos++;
    }
  }

  get videosPaginados(): any[] {
    const inicio = (this.paginaActualVideos - 1) * this.videosPorPagina;
    return this.videos.slice(inicio, inicio + this.videosPorPagina);
  }

  get numeroTotalPaginasVideos(): number {
    return Math.ceil(this.videos.length / this.videosPorPagina);
  }

  paginaAnteriorLibros(): void {
    if (this.paginaActualLibros > 1) {
      this.paginaActualLibros--;
    }
  }

  paginaSiguienteLibros(): void {
    const numeroTotalPaginas = Math.ceil(this.libros.length / this.librosPorPagina);
    if (this.paginaActualLibros < numeroTotalPaginas) {
      this.paginaActualLibros++;
    }
  }

  get librosPaginados(): any[] {
    const inicio = (this.paginaActualLibros - 1) * this.librosPorPagina;
    return this.libros.slice(inicio, inicio + this.librosPorPagina);
  }

  get numeroTotalPaginasLibros(): number {
    return Math.ceil(this.libros.length / this.librosPorPagina);
  }

  paginaAnteriorActividades(): void {
    if (this.paginaActualActividades > 1) {
      this.paginaActualActividades--;
    }
  }

  paginaSiguienteActividades(): void {
    const numeroTotalPaginas = Math.ceil(this.actividades.length / this.actividadesPorPagina);
    if (this.paginaActualActividades < numeroTotalPaginas) {
      this.paginaActualActividades++;
    }
  }

  get actividadesPaginados(): any[] {
    const inicio = (this.paginaActualActividades - 1) * this.actividadesPorPagina;
    return this.actividades.slice(inicio, inicio + this.actividadesPorPagina);
  }

  get numeroTotalPaginasActividades(): number {
    return Math.ceil(this.actividades.length / this.actividadesPorPagina);
  }


}
