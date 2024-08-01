import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-eliminar-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule,MatButtonModule],
  templateUrl: './eliminar-dialog.component.html',
  styleUrl: './eliminar-dialog.component.css'
})
export class EliminarDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) {}

  cerrar(): void {
    this.dialogRef.close(false);
  }

  eliminar(): void {
    this.apiService.eliminarColeccion(this.data.coleccion_id).subscribe(
      response => {
        console.log('Colección eliminada:', response);
        this.dialogRef.close(true); 
      },
      error => {
        console.error('Error al eliminar la colección:', error);
        this.dialogRef.close(false); 
      }
    );
  }
  
}
