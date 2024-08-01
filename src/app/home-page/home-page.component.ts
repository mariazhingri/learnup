import { CommonModule } from '@angular/common';
import { ApplicationRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  mostrarSegundoParrafo: boolean = false;

  constructor(private appRef: ApplicationRef) { }

  toggleSegundoParrafo() {
    this.mostrarSegundoParrafo = !this.mostrarSegundoParrafo;
  }


}
