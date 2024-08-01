import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MateriaModel } from '../models/materia.model';
import { ApiService } from '../api.service';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { VideoModel } from '../models/video.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})
export class UploadVideoComponent implements OnInit {

  @Input() mostrarVideos: boolean = false;
  @Input() mostrarLibros: boolean = false;
  @Input() mostrarActividades: boolean = false;
  @Output() nextStepEvent: EventEmitter<void> = new EventEmitter<void>();

  materiasPreescolar: MateriaModel[] = [];
  materiasPrimaria: MateriaModel[] = [];
  materiasSecundaria: MateriaModel[] = [];
  materiasBachillerato: MateriaModel[] = [];
  selectedNivelMaterias: MateriaModel[] = [];

  mostrarDetallesAdicionales: boolean = false;

  videos: VideoModel[] = [];
  videoTitle: string = '';
  videoDescription: string = '';
  selectedNivel: string = '';
  selectedMateriaId: number | null = null;
  selectedMateriaNombre: string | null = null;

  selectedVideoInput: 'url' | 'file' = 'url';
  selectedVideoFile: File | null = null;
  selectedVideoFileName: string = '';

  videoUrl: string = '';
  videoFile: File | null = null;


  @ViewChild('videoFileInput') videoFileInput!: ElementRef<HTMLInputElement>;


  constructor(private apiService: ApiService, private snackBar: MatSnackBar ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  subirVideo(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      let nuevoVideo: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.videoDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre,
        url: this.selectedVideoInput === 'url' ? this.videoUrl : ''
      };

      const formData = new FormData();
      formData.append('materia_id', nuevoVideo.materia_id.toString());
      formData.append('titulo', nuevoVideo.titulo);
      formData.append('descripcion', nuevoVideo.descripcion);
      formData.append('nivel', nuevoVideo.nivel);
      formData.append('materia', nuevoVideo.materia);

      if (this.selectedVideoInput === 'file' && this.selectedVideoFile) {
        formData.append('video', this.selectedVideoFile, this.selectedVideoFile.name);
      } else if (this.selectedVideoInput === 'url') {
        formData.append('url', nuevoVideo.url);
      }

      this.apiService.postVideos(formData).subscribe(
        (response: any) => {
          console.log('Video subido exitosamente:', response);
          form.resetForm();
          this.resetForm();
          this.showMessageOK();
        },
        (error) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Error de red:', error.error.message);
            } else {
              console.error(`Error del servidor: ${error.status}, ${error.error.message}`);
            }
            console.error('Error al subir el video:', error);
          }
        );
      } else {
        this.showMessageERROR();
      }
    }

    showMessageERROR() {
      this.snackBar.open('Por favor, complete todos los campos antes de subir el video.', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'custom-snack-bar'
      });
    }

    showMessageOK() {
      this.snackBar.open('Video subido exitosamente!', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'custom-snack-bar'
      });
    }




  /*subirVideo(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      let nuevoVideo: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.videoDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre
      };

      if (this.selectedVideoInput === 'url') {
        nuevoVideo.url = form.value.videoUrl;
      } else if (this.selectedVideoInput === 'file' && this.videoFile) {
        nuevoVideo.videoFile = this.videoFile;
      }

      this.apiService.postVideos(nuevoVideo).subscribe(
        (response: any) => {
          console.log('Video subido exitosamente:', response);
          form.resetForm();
          this.resetForm();
        },
        (error) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Error de red:', error.error.message);
          } else {
            console.error(`Error del servidor: ${error.status}, ${error.error.message}`);
          }
          console.error('Error al subir el video:', error);
        }
      );
    } else {
      console.error('Formulario inválido o faltan datos necesarios.');
    }
  }*/


  selectVideoFile(): void {
    this.videoFileInput.nativeElement.click();
  }

  onVideoFileChange(event: any): void {
    this.selectedVideoFile = event.target.files[0];
    console.log('Archivo de video seleccionado:', this.selectedVideoFile);
    this.selectedVideoFileName = this.selectedVideoFile?.name || '';
  }

  isVideoFileSelected(): boolean {
    return this.selectedVideoFile !== null;
  }

  resetForm(): void {
    this.videoTitle = '';
    this.videoDescription = '';
    this.selectedNivel = '';
    this.selectedMateriaId = null;
    this.selectedMateriaNombre = null;
    this.selectedVideoInput = 'url';
    this.videoUrl = '';
    this.selectedVideoFile = null;
    this.selectedVideoFileName = '';
  }

  obtenerMaterias(): void {
    this.apiService.getMaterias().subscribe(
      (response: MateriaModel[]) => {
        console.log('Materias obtenidas:', response);
        this.materiasPreescolar = response.filter(materia => materia.nivel_id === 1);
        this.materiasPrimaria = response.filter(materia => materia.nivel_id === 2);
        this.materiasSecundaria = response.filter(materia => materia.nivel_id === 3);
        this.materiasBachillerato = response.filter(materia => materia.nivel_id === 4);
      },
      (error) => {
        console.error('Error al obtener las materias:', error);
      }
    );
  }

  defaultMateriaText: string = "Seleccione un nivel primero";
  nivelSelected(): void {
    this.defaultMateriaText = "Seleccione una materia";
    switch (this.selectedNivel) {
      case 'Preescolar':
        this.selectedNivelMaterias = this.materiasPreescolar;
        break;
      case 'Primaria':
        this.selectedNivelMaterias = this.materiasPrimaria;
        break;
      case 'Secundaria':
        this.selectedNivelMaterias = this.materiasSecundaria;
        break;
      case 'Bachillerato':
        this.selectedNivelMaterias = this.materiasBachillerato;
        break;
      default:
        this.selectedNivelMaterias = [];
        break;
    }
    this.selectedMateriaId = null;
    this.selectedMateriaNombre = null;
  }

  materiaSelected(event: any): void {
    const selectedMateria = this.selectedNivelMaterias.find(materia => materia.materia_id === +event.target.value);
    if (selectedMateria) {
      this.selectedMateriaId = selectedMateria.materia_id;
      this.selectedMateriaNombre = selectedMateria.nombre;
    }
  }


  isDetailsFilled(): boolean {
    return (
      this.videoTitle !== '' &&
      this.videoDescription !== '' &&
      this.selectedNivel !== '' &&
      this.selectedMateriaId !== null &&
      this.selectedMateriaNombre !== null &&
      ((this.selectedVideoInput === 'url' && this.videoUrl !== '') ||
        (this.selectedVideoInput === 'file' && this.selectedVideoFile !== null))
    );
  }

  nextStep(): void {
    if (this.isDetailsFilled()) {
      this.mostrarDetallesAdicionales = true;
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
