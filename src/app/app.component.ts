import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LevelComponent } from './level/level.component';
import { ThemedComponent } from './themed/themed.component';
import { ResourceMenuComponent } from './resource-menu/resource-menu.component';
import { ResourceVideoComponent } from './resource-video/resource-video.component';
import { ResouceLibroComponent } from './resouce-libro/resouce-libro.component';
import { ResourceActividadComponent } from './resource-actividad/resource-actividad.component';
import { ResourceFullComponent } from './resource-full/resource-full.component';
import { UploadMenuComponent } from './upload-menu/upload-menu.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UploadLibroComponent } from './upload-libro/upload-libro.component';
import { UploadActividadComponent } from './upload-actividad/upload-actividad.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PublicasColeccionesComponent } from './publicas-colecciones/publicas-colecciones.component';
import { PrivadasColeccionesComponent } from './privadas-colecciones/privadas-colecciones.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { CuentaUsuarioComponent } from './cuenta-Usuario-Scree/cuenta-usuario/cuenta-usuario.component';
import {MatDialogModule} from '@angular/material/dialog';
import { delay, EMPTY, Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
//import { createApi } from 'unsplash-js';

//import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatDialogModule,

    //routes,

    //GENERAL COMPONENTS
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    PublicasColeccionesComponent,
    PrivadasColeccionesComponent,
    CuentaUsuarioComponent,

    //NIVEL & TEMA COMPONENTS
    LevelComponent,
    ThemedComponent,
    ResourceMenuComponent,
    ResourceVideoComponent,
    ResourceActividadComponent,
    ResouceLibroComponent,
    ResourceFullComponent,

    //SUBIR RECURSO COMPONENTS
    UploadMenuComponent,
    UploadVideoComponent,
    UploadLibroComponent,
    UploadActividadComponent,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent {
  title = 'LearnUp';
}

/*export class AppComponent implements OnInit {

  public unsplashItems$: Observable<any> = EMPTY;
  title = 'LearnUp';

  async ngOnInit(): Promise<void> {
    const unsplashAPI = createApi({
      accessKey: environment.UNSPLASH_API_KEY,
    });
    const res = await unsplashAPI.photos.list({ page: 1, perPage: 12 });
    if (res.type === 'success') {
      this.unsplashItems$ = of(res.response.results).pipe(delay(600));
    }
  }
}*/


