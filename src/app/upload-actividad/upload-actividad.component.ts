import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MateriaModel } from '../models/materia.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { ActividadModel } from '../models/actividad.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-actividad',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule  ],
  templateUrl: './upload-actividad.component.html',
  styleUrl: './upload-actividad.component.css'
})
export class UploadActividadComponent implements OnInit {

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

  actividades: ActividadModel[] = [];
  activityTitle: string = '';
  activityDescription: string = '';
  selectedNivel: string = '';
  selectedMateriaId: number | null = null;
  selectedMateriaNombre: string | null = null;

  selectedActivityInput: 'url' | 'file' = 'url';
  selectedActivityFile: File | null = null;
  selectedActivityFileName: string = '';
  selectedImageInput: 'url' | 'file' = 'url';

  activityUrl: string = '';
  activityImageUrl: string = '';
  activityImageFile: File | null = null;
  activityImageFileName: string = '';

  showToast = false;

  @ViewChild('activityFileInput') activityFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('activityImageInput') activityImageInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  subirActividad(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      const nuevaActividad: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.activityDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre,
        url: form.value.activityUrl || null,
      };

      const formData = new FormData();
      formData.append('materia_id', nuevaActividad.materia_id);
      formData.append('titulo', nuevaActividad.titulo);
      formData.append('descripcion', nuevaActividad.descripcion);
      formData.append('nivel', nuevaActividad.nivel);
      formData.append('materia', nuevaActividad.materia);
      formData.append('url', nuevaActividad.url || '');

      if (this.selectedActivityInput === 'file' && this.selectedActivityFile) {
        formData.append('pdf', this.selectedActivityFile, this.selectedActivityFile.name);
      }

      if (this.selectedImageInput === 'file' && this.activityImageFile) {
        formData.append('imagen', this.activityImageFile, this.activityImageFile.name);
      }

      this.apiService.postActividades(formData).subscribe(
        (response: any) => {
          console.log('Actividad subida exitosamente:', response);
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
          console.error('Error al subir la actividad:', error);
        }
      );
    } else {
      this.showMessageERROR();
    }
  }

  showMessageERROR() {
    this.snackBar.open('Por favor, complete todos los campos antes de subir la actividad.', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar'
    });
  }

  showMessageOK() {
    this.snackBar.open('Actividad subida exitosamente!', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar'
    });
  }

  /*subirActividad(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      let nuevaActividad: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.activityDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre
      };

      if (this.selectedActivityInput === 'url') {
        nuevaActividad.url = form.value.activityUrl;
      } else if (this.selectedActivityInput === 'file' && this.activityFile) {
        nuevaActividad.activityFile = this.activityFile;
      }

      if (this.activityImageUrl) {
        nuevaActividad.imagen_url = this.activityImageUrl;
      } else if (this.activityImageFile) {
        nuevaActividad.imagen_url = this.activityImageFile;
      }

      this.apiService.postActividades(nuevaActividad).subscribe(
        (response: any) => {
          console.log('Actividad subida exitosamente:', response);
          form.resetForm();
          this.resetForm();
        },
        (error) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Error de red:', error.error.message);
          } else {
            console.error(`Error del servidor: ${error.status}, ${error.error.message}`);
          }
          console.error('Error al subir la actividad:', error);
        }
      );
    } else {
      console.error('Formulario inválido o faltan datos necesarios.');
    }
  }*/

  selectActivityFile(): void {
    this.activityFileInput.nativeElement.click();
  }

  onActivityFileChange(event: any): void {
    this.selectedActivityFile = event.target.files[0];
    console.log('Archivo de actividad seleccionado:', this.selectedActivityFile);
    this.selectedActivityFileName = this.selectedActivityFile?.name || '';
  }

  selectActivityImage(): void {
    this.activityImageInput.nativeElement.click();
  }

  onActivityImageChange(event: any): void {
    this.activityImageFile = event.target.files[0];
    console.log('Imagen de actividad seleccionada:', this.activityImageFile);
    this.activityImageFileName = this.activityImageFile?.name || '';
  }

  isActivityFileSelected(): boolean {
    return this.selectedActivityFile !== null;
  }

  isActivityImageSelected(): boolean {
    return this.activityImageFile !== null;
  }


  resetForm(): void {
    this.activityTitle = '';
    this.activityDescription = '';
    this.selectedNivel = '';
    this.selectedMateriaId = null;
    this.selectedMateriaNombre = null;
    this.selectedActivityInput = 'url';
    this.activityUrl = '';
    this.selectedActivityFile = null;
    this.selectedActivityFileName = '';
    this.selectedImageInput = 'url';
    this.activityImageUrl = '';
    this.activityImageFile = null;
    this.activityImageFileName = '';

    if (this.activityFileInput) {
      this.activityFileInput.nativeElement.value = '';
    }
    if (this.activityImageInput) {
      this.activityImageInput.nativeElement.value = '';
    }
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
      this.activityTitle!== '' &&
      this.activityDescription!== '' &&
      this.selectedNivel!== '' &&
      this.selectedMateriaId!== null &&
      this.selectedMateriaNombre!== null &&
      ((this.selectedActivityInput === 'url' && this.activityUrl!== '') ||
        (this.selectedActivityInput === 'file' && this.selectedActivityFile!== null)) &&
      (this.activityImageUrl!== '' || this.activityImageFile!== null)
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
