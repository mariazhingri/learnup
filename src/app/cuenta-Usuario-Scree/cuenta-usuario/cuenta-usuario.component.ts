import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { PantallaDialog } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field'

interface Usuario {
  id: number,
  username: string;
  correo: string;
  sexo: string;
  institucion: string;
  fechanacimiento: string;
  celular: string;
  niveleducatito: string;
  tipocuenta: string;
  // Otros campos del usuario logueado
}

@Component({
  selector: 'app-cuenta-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuenta-usuario.component.html',
  styleUrl: './cuenta-usuario.component.css'
})

export class CuentaUsuarioComponent implements OnInit{
  formularioDatosUsuario: FormGroup;
  showOptions = false;
  usuario: any;
  private destroy$ = new Subject<void>();
  readonly dialog = inject(MatDialog);
  durationInSeconds = 5;

  
  

  constructor(private router: Router, private fb: FormBuilder, private apiservice: ApiService,private _snackBar: MatSnackBar) {
    this.formularioDatosUsuario = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      sexo: [''],
      institucion:[''],
      fechanacimiento: [''],
      celular: ['',[Validators.pattern('[0-9]*'), Validators.minLength(10)]],
      niveleducatito: ['']
    })
  }
  
  ngOnInit(): void {
    this.getDatosApi();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  get f() { return this.formularioDatosUsuario.controls; }

  markAllFieldsAsTouched() {
    Object.keys(this.formularioDatosUsuario.controls).forEach(field => {
      const control = this.formularioDatosUsuario.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getnivelEducativo() {
    const contenidoSelect = document.querySelector('#select .contenedor-niveleducativo p');
    return contenidoSelect ? contenidoSelect.textContent : '';
  }
  getDatosApi() {
    const userInfo = this.apiservice.getUserInfoFromToken();
    if (userInfo) {
      const userId = userInfo.id;
      this.apiservice.getUsers().subscribe(response => {
        this.usuario = response.find((u: Usuario) => u.id === userId);
      });
    } else {
      console.error('No se encontró información de usuario en el token');
    }
  }
  
  guardarcambios() {
    this.markAllFieldsAsTouched();
    // Detener la ejecución si el formulario es inválido
    if (this.formularioDatosUsuario.valid) {
      console.log('Formulario Actualizado', this.formularioDatosUsuario.value);

      const user = {
        //id: this.getTokenUserId(), 
        username: this.f['username'].value,
        correo: this.f['correo'].value,
        //password: this.f['password'].value,
        sexo: this.f['sexo'].value,
        institucion: this.f['institucion'].value,
        fechanacimiento: this.f['fechanacimiento'].value,
        celular: this.f['celular'].value,
        niveleducatito: this.getnivelEducativo(),
      };

      this.apiservice.postActualizartabla(user).subscribe(response => {
        console.log('Usuario Actualizado exitosamente', response);
        this.openSnackBar();
      }, error => {
        console.error('Error al actualizar el usuario', error);
      });

      return;
    }
  }


  mostrarOpciones() {
    const opcionesElement = document.getElementById('opciones');
    const contenidoSelect = document.querySelector('#select .contenedor-niveleducativo');

    document.querySelectorAll('.opcion').forEach((opcion) => {
        opcion.addEventListener('click', (e) => {
            e.preventDefault();
            const textoOpcion = (e.currentTarget as HTMLElement).textContent;
            if (contenidoSelect) {
                const parrafo = contenidoSelect.querySelector('p');
                if (parrafo) {
                  parrafo.textContent = textoOpcion || "";
                  parrafo.classList.add('blanco');
                }
            }
        });
    });

    if (opcionesElement) {
        opcionesElement.classList.toggle('active');
    }
  }
  closeOpciones() {
    this.showOptions = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Cierra las opciones si se hace clic fuera del botón y las opciones
    const target = event.target as HTMLElement;
    if (!target.closest('.fa-sign-out-alt') && !target.closest('.opciones')) {
      this.showOptions = false;
    }
  }

  eliminarcuenta() {
    const userInfo = this.apiservice.getUserInfoFromToken();
    if (userInfo) {
      const userId = userInfo.id;
      this.apiservice.deleteCuenta(userId).subscribe(response => {
        console.log('Usuario eliminado exitosamente', response);
      }, error => {
        console.error('Error al eliminar el usuario', error);
      });
    } else {
      console.error('No se encontró información de usuario en el token');
    }
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PantallaDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  openSnackBar() {
    this._snackBar.openFromComponent(SnackBar, {
      duration: this.durationInSeconds * 1000,
    });
  }

}

@Component({
  selector: 'app-sback',
  templateUrl: 'snackBar.html',
  styles: `
    :host {
      display: flex;
    }

    .example-pizza-party {
      color: hotpink;
    }
  `,
  standalone: true,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
})
export class SnackBar {
  snackBarRef = inject(MatSnackBarRef);
}