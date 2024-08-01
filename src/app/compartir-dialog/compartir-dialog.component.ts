import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-compartir-dialog',
  standalone: true,
  imports: [ MatDialogModule, MatFormFieldModule, MatInputModule,MatButtonModule,MatExpansionModule],
  templateUrl: './compartir-dialog.component.html',
  styleUrl: './compartir-dialog.component.css'
})
export class CompartirDialogComponent {
  shareLink: string;

  constructor(
    public dialogRef: MatDialogRef<CompartirDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shareLink = data.shareLink;
  }

  close(): void {
    this.dialogRef.close();
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink).then(() => {
      alert('Enlace copiado al portapapeles');
    }, (err) => {
      console.error('Error al copiar el enlace: ', err);
    });
  }
}
