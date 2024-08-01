import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-eliminar-recurso-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule,MatButtonModule],
  templateUrl: './eliminar-recurso-dialog.component.html',
  styleUrl: './eliminar-recurso-dialog.component.css'
})
export class EliminarRecursoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarRecursoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  cerrar(): void {
    this.dialogRef.close(false);
  }

  eliminar(): void {
    this.apiService.eliminarRecursoDeColeccion(this.data.coleccion_id,this.data.recurso_id).subscribe(
      response => {
        console.log('Recurso eliminado de la colección:', response);
        this.dialogRef.close(true); 
      },
      error => {
        console.error('Error al eliminar la colección:', error);
        this.dialogRef.close(false); 
      }
    );
  }

}
