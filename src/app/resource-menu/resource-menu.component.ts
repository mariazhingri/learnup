import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnInit, Output, Input, EventEmitter, ElementRef, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { HomePageComponent } from '../home-page/home-page.component';
import { ResourceVideoComponent } from '../resource-video/resource-video.component';
import { ActivatedRoute } from '@angular/router';
import { ResouceLibroComponent } from '../resouce-libro/resouce-libro.component';
import { ResourceActividadComponent } from '../resource-actividad/resource-actividad.component';

@Component({
  selector: 'app-resource-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, HomePageComponent, ResourceMenuComponent, ResourceVideoComponent, ResouceLibroComponent, ResourceActividadComponent],
  templateUrl: './resource-menu.component.html',
  styleUrls: ['./resource-menu.component.css']
})
export class ResourceMenuComponent implements AfterViewInit, OnInit  {

  @Output() nivelSeleccionado: EventEmitter<any> = new EventEmitter();
  @ViewChild('videoSection') videoSection!: ElementRef;
  @ViewChild('libroSection') libroSection!: ElementRef;
  @ViewChild('actividadSection') actividadSection!: ElementRef;

  nivel: string = '';
  swiper!: Swiper;
  materiaId: number | undefined;
  mostrarVideos: boolean = false;
  mostrarLibros: boolean = false;
  mostrarActividades: boolean = false;
  resourceToShow: string | undefined;

  constructor(private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.materiaId = +params['materiaId'];
    });
  }

  ngAfterViewInit(): void {
    new Swiper('.review-slider', {
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }


  /*toggleVideos(videoSlide: HTMLElement): void {
    this.mostrarVideos = !this.mostrarVideos;
    setTimeout(() => {
        const tituloSeccion = document.querySelector('.about .title') as HTMLElement;
        if (tituloSeccion) {
            tituloSeccion.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            //window.scrollBy(0, 650);
            window.scrollTo({ top: 730, behavior: 'smooth' });
        } else {
            console.error('Elemento del título de la sección no encontrado');
        }
    }, 100);
  }

  toggleLibros(libroSlide: HTMLElement): void {
    this.mostrarLibros = !this.mostrarLibros;
    setTimeout(() => {
        const tituloSeccion = document.querySelector('.about .title') as HTMLElement;
        if (tituloSeccion) {
            tituloSeccion.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            //window.scrollBy(0, 650);
            window.scrollTo({ top: 730, behavior: 'smooth' });
        } else {
            console.error('Elemento del título de la sección no encontrado');
        }
    }, 100);
  }

  toggleActividades(actividadSlide: HTMLElement): void {
    this.mostrarActividades = !this.mostrarActividades;
    setTimeout(() => {
      const tituloSeccion = document.querySelector('.about .title') as HTMLElement;
      if (tituloSeccion) {
        tituloSeccion.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        //window.scrollBy(0, 650);
        window.scrollTo({ top: 730, behavior: 'smooth' });
      } else {
        console.error('Elemento del título de la sección no encontrado');
      }
    }, 100);
  }*/


  toggleResource(resource: string): void {
    if (resource === 'videos') {
      this.mostrarVideos = true;
      this.mostrarLibros = false;
      this.mostrarActividades = false;
      this.resourceToShow = 'videos';
    } else if (resource === 'libros') {
      this.mostrarVideos = false;
      this.mostrarLibros = true;
      this.mostrarActividades = false;
      this.resourceToShow = 'libros';
    } else if (resource === 'actividades') {
      this.mostrarVideos = false;
      this.mostrarLibros = false;
      this.mostrarActividades = true;
      this.resourceToShow = 'actividades';
    }
    setTimeout(() => {
      const tituloSeccion = document.querySelector('.about .title') as HTMLElement;
      if (tituloSeccion) {
        tituloSeccion.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        //window.scrollBy(0, 650);
        window.scrollTo({ top: 730, behavior: 'smooth' });
      } else {
        console.error('Elemento del título de la sección no encontrado');
      }
    }, 100);
  }


  mostrarMaterias(nivel: string, materia: string): void {
    this.nivelSeleccionado.emit({nivel: nivel, materia: materia});
  }


  scrollToVideos() {
    this.videoSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
