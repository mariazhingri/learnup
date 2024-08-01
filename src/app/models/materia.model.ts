export interface MateriaListModel {
  items:      MateriaModel[];
}

export interface MateriaModel {
  materia_id:   number;
  nivel_id:     number;
  nombre:       string;
  imagen:       string;
  fecha:        Date;
  autor:        string;
  descripcion:  string;
}

