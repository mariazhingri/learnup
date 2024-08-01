export interface VideoListModel {
  items:      VideoModel[];
}

export interface VideoModel {
  video_id:     number;
  materia_id:   number;
  titulo:       string;
  url:          string;
  descripcion:  string;
  nivel:        string;
  materia:      string;
}
