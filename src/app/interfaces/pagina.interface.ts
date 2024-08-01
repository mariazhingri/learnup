export interface Paginable<T> {
  videosPorPagina: number;
  librosPorPagina: number;
  actividadesPorPagina: number;

  paginaActualVideos: number;
  paginaActualLibros: number;
  paginaActualActividades: number;

  paginaAnteriorVideos(): void;
  paginaSiguienteVideos(): void;
  get videosPaginados(): T[];
  get numeroTotalPaginasVideos(): number;

  paginaAnteriorLibros(): void;
  paginaSiguienteLibros(): void;
  get librosPaginados(): T[];
  get numeroTotalPaginasLibros(): number;

  paginaAnteriorActividades(): void;
  paginaSiguienteActividades(): void;
  get actividadesPaginados(): T[];
  get numeroTotalPaginasActividades(): number;
}
