export interface ActividadListModel {
  items:      ActividadModel[];
}

export interface ActividadModel {
  actividad_id: number;
  materia_id:   number;
  titulo:       string;
  imagen_url:   string;
  url:          string;
  descripcion:  string;
  nivel:        string;
  materia:      string;
}
