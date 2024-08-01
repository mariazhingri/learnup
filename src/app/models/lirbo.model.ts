export interface LibroListModel {
  items:      LibroModel[];
}

export interface LibroModel {
  actividad_id: number;
  materia_id:   number;
  titulo:       string;
  imagen_url:   string;
  url:          string;
  autor:        string;
  edicion:      string;
  fecha:        Date;
  descripcion:  string;
  nivel:        string;
  materia:      string;
}
