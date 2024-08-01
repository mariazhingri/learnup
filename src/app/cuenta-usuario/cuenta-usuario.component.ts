import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cuenta-usuario.component.html',
  styleUrl: './cuenta-usuario.component.css'
})
export class CuentaUsuarioComponent implements OnInit{
  FormularioDatosUsuario: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private apiservice: ApiService) {
    this.FormularioDatosUsuario = this.fb.group({
      niveleducativo: ['', [Validators.required]], 
    })
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  get f() { return this.FormularioDatosUsuario.controls; }

  getnivelEdicativo() {
    const contenidoSelect = document.querySelector('#select .contenedor-niveleducativo p');
    return contenidoSelect ? contenidoSelect.textContent : '';
  }

  onSubmit() {

    // Detener la ejecución si el formulario es inválido
    if (this.FormularioDatosUsuario.valid) {
      // Procesar el formulario
      console.log('prueba de nivel educativo', this.FormularioDatosUsuario.value);

      const user = {
        niveleducativo: this.getnivelEdicativo()
      };
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

}
