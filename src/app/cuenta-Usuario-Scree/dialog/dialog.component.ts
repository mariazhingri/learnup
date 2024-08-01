import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-dialog',
  templateUrl: 'patalla-dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PantallaDialog {
  readonly dialogRef = inject(MatDialogRef<PantallaDialog>);

  constructor(private router: Router, private fb: FormBuilder, private apiservice: ApiService) {}

  eliminarcuenta() {
    const userInfo = this.apiservice.getUserInfoFromToken();
    if (userInfo) {
      const userId = userInfo.id;
      this.apiservice.deleteCuenta(userId).subscribe(response => {
        console.log('Usuario eliminado exitosamente', response);
        this.router.navigate(['/home']);
        this.apiservice.logout();
      }, error => {
        console.error('Error al eliminar el usuario', error);
      });
    } else {
      console.error('No se encontró información de usuario en el token');
    }
  }
}

