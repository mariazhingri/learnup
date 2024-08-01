import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';


interface Nombre {
  nombre: string;
  selected: boolean;
  coleccion_id?: number; 
}

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './colecciones.component.html',
  styleUrls: ['./colecciones.component.css']
})
export class ColeccionesComponent implements OnInit {
  frmLista!: FormGroup;
  @Input() nombres: Nombre[] = [];
  selectedResource: any;


  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ColeccionesComponent>,) {
    this.selectedResource = data.recurso;
    console.log('Recurso seleccionado:', this.data.recurso);
  }

  ngOnInit(): void {
    this.frmLista = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      privacidad: ['', [Validators.required]],
      nombres: this.formBuilder.array([])
    });
    this.obtenerNombresColecciones();
  }

  obtenerNombresColecciones(): void {
    this.apiService.obtenerColecciones().subscribe(
      (colecciones: { nombre: string; selected: boolean; coleccion_id: number }[]) => {
        this.nombres = colecciones.map(coleccion => ({
          nombre: coleccion.nombre,
          selected: false,
          coleccion_id: coleccion.coleccion_id
        }));
        this.actualizarCheckboxes();
      },
      (error) => {
        console.error('Error al obtener los nombres de las colecciones:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.frmLista.valid) {
      const nombre = this.frmLista.get('nombre')?.value;
      const esPrivado = this.frmLista.get('privacidad')?.value === 'true';

      this.apiService.crearColeccion(nombre, esPrivado).subscribe(
        (response) => {
          console.log('Colección creada:', response);
          this.snackBar.open('Colección creada', 'Cerrar');
          this.obtenerNombresColecciones();
        },
        (error) => {
          console.error('Error al crear la colección:', error);
        }
      );
      this.frmLista.get('nombre')?.reset();

      this.actualizarCheckboxes();
    }
  }

  private actualizarCheckboxes(): void {
    const nombresArray = this.frmLista.get('nombres') as FormArray;
    nombresArray.clear();
    this.nombres.forEach(nombre => {
      nombresArray.push(this.formBuilder.control(false));
    });
  }

  get nombresArray(): FormArray {
    return this.frmLista.get('nombres') as FormArray;
  }

  getNombreControl(index: number): FormControl {
    return this.nombresArray.at(index) as FormControl;
  }

  selectedCollection: any = null; 

  onSelectCollection(collection: any) {
    this.selectedCollection = collection;
    console.log('Selected collection:', this.selectedCollection);
  }

  guardarRecurso(): void {
    if (!this.nombresArray || !this.nombres) {
      console.error('nombresArray or nombres is not defined');
      return;
    }
  
    const selectedCollections: number[] = this.nombresArray.controls
      .map((control, i) => {
        console.log(`Checkbox ${i} value: `, control.value); // Debugging log
        if (control.value && this.nombres[i]) {
          return this.nombres[i].coleccion_id;
        }
        return null;
      })
      .filter((value): value is number => value !== null && value !== undefined);
  
    if (selectedCollections.length === 0) {
      console.error('No collections selected');
      return;
    }
  
    console.log('Selected collections:', selectedCollections);
  
    this.selectedResource = this.data.recurso;
    console.log('Selected resource:', this.selectedResource);
  
    let resourceType: string | null = null;
    let resourceId: number | null = null;
    let resourceTitle: string | null = null;
    let resourceDescription: string | null = null;
    let resourceUrl: string | null = null;
    let resourceImageUrl: string | null = null;

  
    if (this.selectedResource.video_id) {
      resourceType = 'video';
      resourceId = this.selectedResource.video_id;
    } else if (this.selectedResource.actividad_id) {
      resourceType = 'actividad';
      resourceId = this.selectedResource.actividad_id;
    } else if (this.selectedResource.libro_id) {
      resourceType = 'libro';
      resourceId = this.selectedResource.libro_id;
    }

    resourceTitle = this.selectedResource.titulo;
    resourceDescription = this.selectedResource.descripcion;
    resourceUrl = this.selectedResource.url;
    resourceImageUrl = this.selectedResource.imagen_url;

    if (!resourceType || !resourceId) {
      console.error('Selected resource is missing a valid ID');
      return;
    }
  
    const resourceData = {
      type: resourceType,
      id: resourceId,
      titulo: resourceTitle,
      descripcion: resourceDescription,
      url: resourceUrl,
      image_url: resourceImageUrl,
      collections: selectedCollections 
    };
  
    console.log('Resource data to send:', resourceData);
  
    this.apiService.guardarRecursoEnColeccion(resourceData, selectedCollections).subscribe(
      (response) => {
        console.log('Recurso guardado en la colección:', response);
        this.dialogRef.close(); 
        this.snackBar.open('Recurso guardado', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
        });
      },
      (error) => {
        console.error('Error al guardar el recurso en la colección:', error);
      }
    );
  }
  
}