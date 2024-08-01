import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { CompartirDialogComponent } from '../compartir-dialog/compartir-dialog.component';

@Component({
  selector: 'app-publicas-colecciones',
  standalone: true,
  imports:[
    CommonModule,
    RouterModule,
  ],
  templateUrl: './publicas-colecciones.component.html',
  styleUrls: ['./publicas-colecciones.component.css']
})
export class PublicasColeccionesComponent implements OnInit {
  actividades: any[] = [];
  videos: any[] = [];
  videos2: any[] = [];
  libros: any[] = [];
  mostrarContenido2 = false;  
  sanitizedUrls: { [key: string]: SafeResourceUrl } = {};
  // sanitizedUrls: { [key: string]: SafeResourceUrl } = {};
  // sanitizedUrls2: { [key: string]: SafeResourceUrl } = {};
  colecciones: any[] = [];
  recursos: any[] = [];
  selectedColeccion: any = null;
  mostrarContenido: boolean = false;

  imagenes: string[] = [
    'https://img.freepik.com/free-photo/light-bulb-ideas-creative-diagram-concept_53876-92925.jpg?t=st=1720662497~exp=1720666097~hmac=e7d89123280b865194b0c8f0c6c70f6318c4f11af8ad877111e9ad4b8ac935fc&w=740',
    'https://img.freepik.com/free-photo/network-connection-graphic-overlay-banner-desk_53876-120478.jpg?t=st=1720663213~exp=1720666813~hmac=55f41638c55e0e4e6a5a608896822fc27ac0064ebeb9bf153ccfac32f8a14e83&w=740',
    'https://img.freepik.com/free-photo/books-imagination-still-life_23-2149082160.jpg?t=st=1720663259~exp=1720666859~hmac=aa087c1f71725687ee4fd6a9b6123bdfdeb375fdf1e694e13f0168852fdb8d09&w=740',
    'https://img.freepik.com/free-photo/books-imagination-still-life_23-2149082156.jpg?t=st=1720663276~exp=1720666876~hmac=4730e0abbd0c14d8f166b0ead1c094b1e7367342151aec25bd8ced687c231c43&w=740',
    'https://img.freepik.com/free-photo/books-imagination-still-life_23-2149082166.jpg?t=st=1720663307~exp=1720666907~hmac=6831b76d3d0abc40f75338c7db72d5e1b0784c0fd3c99ba3b196217ca281d0e6&w=740',
    'https://img.freepik.com/free-photo/international-day-education-scene-with-fantasy-style_23-2151040369.jpg?t=st=1720663338~exp=1720666938~hmac=d4db335cc68ddbef9a031f901c745c3c1fe997cdd049eb35a3a22a188eb04034&w=740',
    'https://img.freepik.com/free-photo/international-day-education-scene-with-fantasy-style_23-2151040361.jpg?t=st=1720663365~exp=1720666965~hmac=77716a38dd1191c145de3136a8222f13b748b64cc8bf1dba7864bc0387687c8d&w=740',
  ];

   // toggleContenido() {
   //   this.mostrarContenido = !this.mostrarContenido;  
   //   if (this.mostrarContenido) {
   //     this.mostrarContenido2 = false;
   //   }
   // }

   // toggleContenido2() {
   //   this.mostrarContenido2 = !this.mostrarContenido2;
   //   if (this.mostrarContenido2) {
   //     this.mostrarContenido = false;
   //   }  
   // }

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.apiService.getActividades().subscribe((data: any[]) => {
    //   this.actividades = data.slice(0,1);
    // });

    // this.apiService.getVideos().subscribe((data: any[]) => {
    //   this.videos = data.slice(0, 2);
    //   this.sanitizeUrls(); 
    // });

    // this.apiService.getLibros().subscribe((data:any[]) =>{
    //   this.libros=data.slice(1,2);
    // })

    // this.apiService.getVideos().subscribe((data: any[]) => {
    //   this.videos2 = data.slice(2, 4);
    //   this.sanitizeUrls2(); 
    // });
    this.apiService.obtenerColeccionesPublicas().subscribe((data: any[]) => {
      this.colecciones = data;
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // private sanitizeUrls() {
  //   this.videos.forEach(video => {
  //     this.sanitizedUrls[video.video_id] = this.sanitizer.bypassSecurityTrustResourceUrl(video.url);
  //   });
  // }

  // private sanitizeUrls2() {
  //   this.videos2.forEach(video => {
  //     this.sanitizedUrls2[video.video_id] = this.sanitizer.bypassSecurityTrustResourceUrl(video.url);
  //   });
  // }

  // getSafeUrl(video_id: number): SafeResourceUrl | undefined {
  //   return this.sanitizedUrls[video_id];
  // }

  // getSafeUrl2(video_id: number): SafeResourceUrl | undefined {
  //   return this.sanitizedUrls2[video_id];
  // }

  verRecursos(coleccion: any) {
    this.selectedColeccion = coleccion;
    this.apiService.obtenerRecursosDeColeccion(coleccion.coleccion_id).subscribe((data: any[]) => {
      this.recursos = data;
      this.sanitizeUrls();
      this.mostrarContenido = true;
    });
  }

  toggleContenido() {
    this.mostrarContenido = !this.mostrarContenido;
  }

  getImagenUrl(coleccion: any): string {
    const index = this.colecciones.indexOf(coleccion) % this.imagenes.length;
    return this.imagenes[index];
  }

  private sanitizeUrls() {
    this.recursos.forEach(recurso => {
      if (recurso.recurso_tipo === 'video') {
        this.sanitizedUrls[recurso.url] = this.sanitizer.bypassSecurityTrustResourceUrl(recurso.url);
      }
    });
  }

  getSafeUrl(url: string): SafeResourceUrl | undefined {
    return this.sanitizedUrls[url];
  }

  openShareDialog(collectionName: string): void {
         const shareLink = `https://Learnup.com/colecciones/${collectionName}`;
         this.dialog.open(CompartirDialogComponent, {
           data: { shareLink }
         });
       }
}
