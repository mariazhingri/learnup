// src/app/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MustMatch, noSpecialCharactersValidator } from './MustMatch';
import { ApiService } from '../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  FormularioRegistro: FormGroup;
  mostrar: boolean = false;
  checkboxError: boolean = false;
  users: any[] = [];
  
  constructor(private router: Router, private fb: FormBuilder, private apiservice: ApiService,private snackBar: MatSnackBar) {
    this.FormularioRegistro = this.fb.group({
      tipocuenta: [''], 
      username: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        noSpecialCharactersValidator()
      ]],
      repeatpassword: ['', [Validators.required, Validators.minLength(8)]],
      termsCheckbox: [false, Validators.requiredTrue] // Agregamos el control del checkbox al formulario
    }, {
      validator: MustMatch('password', 'repeatpassword')
    });
  }

  // Agrega un getter para acceder fácilmente a los campos del formulario
  get f() { return this.FormularioRegistro.controls; }

  ngOnInit() {
    const userData = {}; 
    this.apiservice.postUsers(userData).subscribe(data => {
      this.users = data;
    });
  }

  markAllFieldsAsTouched() {
    Object.keys(this.FormularioRegistro.controls).forEach(field => {
      const control = this.FormularioRegistro.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  onSubmit() {
    // Marcar todos los campos como tocados para mostrar los errores de validación
    this.markAllFieldsAsTouched();
  
    const checkbox = document.getElementById('termsCheckbox') as HTMLInputElement;
    // Verificar si el checkbox no está marcado
    if (checkbox.checked) {
      this.checkboxError = false;
    } else {
      this.checkboxError = true;
      return;
    }
    // Detener la ejecución si el formulario es inválido
    if (this.FormularioRegistro.valid) {
      // Procesar el formulario
      console.log('Formulario Enviado', this.FormularioRegistro.value);

      const user = {
        username: this.f['username'].value,
        correo: this.f['correo'].value,
        password: this.f['password'].value,
        tipocuenta: this.getTipoCuenta()
      };

      this.apiservice.postUsers(user).subscribe(response => {
        console.log('Usuario registrado exitosamente', response);
        this.showMessage();
        this.router.navigate(['/login']); // Navega a la página de login tras el registro exitoso
      }, error => {
        console.error('Error registrando el usuario', error);
      });

      return;
    }
  }

  getTipoCuenta() {
    const contenidoSelect = document.querySelector('#select .contenedor-tipocuenta p');
    return contenidoSelect ? contenidoSelect.textContent : '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  mostrarOpciones() {
    const opcionesElement = document.getElementById('opciones');
    const contenidoSelect = document.querySelector('#select .contenedor-tipocuenta');

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
  showMessage() {
    this.snackBar.open('Usuario regsitrado exitosamente', 'Cerrar', {
      duration: 3000, // duración en milisegundos (5000ms = 5 segundos)
    });
  }
}
