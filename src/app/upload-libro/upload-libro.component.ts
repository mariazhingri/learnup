import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MateriaModel } from '../models/materia.model';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { LibroModel } from '../models/lirbo.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-libro',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './upload-libro.component.html',
  styleUrl: './upload-libro.component.css'
})
export class UploadLibroComponent implements OnInit {

  @Input() mostrarVideos: boolean = false;
  @Input() mostrarActividades: boolean = false;
  @Input() mostrarLibros: boolean = false;
  @Output() nextStepEvent: EventEmitter<void> = new EventEmitter<void>();

  materiasPreescolar: MateriaModel[] = [];
  materiasPrimaria: MateriaModel[] = [];
  materiasSecundaria: MateriaModel[] = [];
  materiasBachillerato: MateriaModel[] = [];
  selectedNivelMaterias: MateriaModel[] = [];

  mostrarDetallesAdicionales: boolean = false;

  libros: LibroModel[] = [];
  libroTitle: string = '';
  libroDescription: string = '';
  selectedNivel: string = '';
  selectedMateriaId: number | null = null;
  selectedMateriaNombre: string | null = null;

  selectedLibroInput: 'url' | 'file' = 'url';
  selectedLibroFile: File | null = null;
  selectedLibroFileName: string = '';
  selectedImageInput: 'url' | 'file' = 'url';

  libroUrl: string = '';
  libroImageUrl: string = '';
  libroImageFile: File | null = null;
  libroImageFileName: string = '';
  autor: string = '';
  edicion: string = '';
  fecha: Date | null = null;

  @ViewChild('libroFileInput') libroFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('libroImageInput') libroImageInput!: ElementRef<HTMLInputElement>;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar ) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  subirLibro(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      const nuevoLibro: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.libroDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre,
        autor: this.autor,
        edicion: this.edicion,
        fecha: this.fecha
      };

      const formData = new FormData();
      formData.append('materia_id', nuevoLibro.materia_id);
      formData.append('titulo', nuevoLibro.titulo);
      formData.append('descripcion', nuevoLibro.descripcion);
      formData.append('nivel', nuevoLibro.nivel);
      formData.append('materia', nuevoLibro.materia);
      formData.append('autor', nuevoLibro.autor);
      formData.append('edicion', nuevoLibro.edicion);
      formData.append('fecha', nuevoLibro.fecha);
      if (this.selectedLibroInput === 'url') {
        formData.append('url', this.libroUrl);
      }
      if (this.selectedImageInput === 'url') {
        formData.append('imagen_url', this.libroImageUrl);
      }
      if (this.selectedLibroFile) {
        formData.append('pdf', this.selectedLibroFile, this.selectedLibroFile.name);
      }
      if (this.libroImageFile) {
        formData.append('imagen', this.libroImageFile, this.libroImageFile.name);
      }

      this.apiService.postLibros(formData).subscribe(
        (response: any) => {
          console.log('Libro subido exitosamente:', response);
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
          console.error('Error al subir el libro:', error);
        }
      );
    } else {
      this.showMessageERROR();
    }
  }

  showMessageERROR() {
    this.snackBar.open('Por favor, complete todos los campos antes de subir el libro.', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar'
    });
  }

  showMessageOK() {
    this.snackBar.open('Libro subido exitosamente!', 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'custom-snack-bar'
    });
  }


  /*subirLibro(form: NgForm): void {
    if (form.valid && this.selectedMateriaId && this.selectedMateriaNombre) {
      let nuevoLibro: any = {
        materia_id: this.selectedMateriaId,
        titulo: form.value.titulo,
        descripcion: form.value.libroDescription,
        nivel: this.selectedNivel,
        materia: this.selectedMateriaNombre,
        autor: this.autor,
        edicion: this.edicion,
        fecha: this.fecha
      };

      if (this.selectedLibroInput === 'url') {
        nuevoLibro.url = form.value.libroUrl;
      } else if (this.selectedLibroInput === 'file' && this.selectedLibroFile) {
        nuevoLibro.libroFile = this.selectedLibroFile;
      }

      if (this.libroImageUrl) {
        nuevoLibro.imagen_url = this.libroImageUrl;
      } else if (this.libroImageFile) {
        nuevoLibro.imagen_url = this.libroImageFile;
      }

      this.apiService.postLibros(nuevoLibro).subscribe(
        (response: any) => {
          console.log('Libro subido exitosamente:', response);
          form.resetForm();
          this.resetForm();
        },
        (error) => {
          if (error.error instanceof ErrorEvent) {
            console.error('Error de red:', error.error.message);
          } else {
            console.error(Error del servidor: ${error.status}, ${error.error.message});
          }
          console.error('Error al subir el libro:', error);
        }
      );
    } else {
      console.error('Formulario inválido o faltan datos necesarios.');
    }
  }*/

  selectLibroFile(): void {
    this.libroFileInput.nativeElement.click();
  }

  onLibroFileChange(event: any): void {
    this.selectedLibroFile = event.target.files[0];
    console.log('Archivo de libro seleccionado:', this.selectedLibroFile);
    this.selectedLibroFileName = this.selectedLibroFile?.name || '';
  }

  selectLibroImage(): void {
    this.libroImageInput.nativeElement.click();
  }

  onLibroImageChange(event: any): void {
    this.libroImageFile = event.target.files[0];
    console.log('Imagen de libro seleccionada:', this.libroImageFile);
    this.libroImageFileName = this.libroImageFile?.name || '';
  }

  isLibroFileSelected(): boolean {
    return this.selectedLibroFile !== null;
  }

  isLibroImageSelected(): boolean {
    return this.libroImageFile !== null;
  }

  resetForm(): void {
    this.libroTitle = '';
    this.libroDescription = '';
    this.selectedNivel = '';
    this.selectedMateriaId = null;
    this.selectedMateriaNombre = null;
    this.selectedLibroInput = 'url';
    this.libroUrl = '';
    this.selectedLibroFile = null;
    this.selectedLibroFileName = '';
    this.selectedImageInput = 'url';
    this.libroImageUrl = '';
    this.libroImageFile = null;
    this.libroImageFileName = '';
    this.autor = '';
    this.edicion = '';
    this.fecha = null;

    if (this.libroFileInput) {
      this.libroFileInput.nativeElement.value = '';
    }
    if (this.libroImageInput) {
      this.libroImageInput.nativeElement.value = '';
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
      this.libroTitle!== '' &&
      this.libroDescription!== '' &&
      this.selectedNivel!== '' &&
      this.selectedMateriaId!== null &&
      this.selectedMateriaNombre!== null &&
      ((this.selectedLibroInput === 'url' && this.libroUrl!== '') ||
        (this.selectedLibroInput === 'file' && this.selectedLibroFile!== null)) &&
      (this.libroImageUrl!== '' || this.libroImageFile!== null) &&
      this.autor!== '' &&
      this.edicion!== '' &&
      this.fecha!== null
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
