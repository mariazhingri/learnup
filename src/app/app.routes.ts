import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LevelComponent } from './level/level.component';
import { ThemedComponent } from './themed/themed.component';
import { ResourceMenuComponent } from './resource-menu/resource-menu.component';
import { ResourceVideoComponent } from './resource-video/resource-video.component';
import { ResouceLibroComponent } from './resouce-libro/resouce-libro.component';
import { ResourceActividadComponent } from './resource-actividad/resource-actividad.component';
import { ResourceFullComponent } from './resource-full/resource-full.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PublicasColeccionesComponent } from './publicas-colecciones/publicas-colecciones.component';
import { PrivadasColeccionesComponent } from './privadas-colecciones/privadas-colecciones.component';
import { UploadMenuComponent } from './upload-menu/upload-menu.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UploadLibroComponent } from './upload-libro/upload-libro.component';
import { UploadActividadComponent } from './upload-actividad/upload-actividad.component';
import { ProtectedComponent } from './protected/ProtectedComponent ';
import { AuthGuard } from './AuthGuard';
import { CuentaUsuarioComponent } from './cuenta-Usuario-Scree/cuenta-usuario/cuenta-usuario.component';


export const routes: Routes =
[
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  //{ path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'nivel', component: LevelComponent },
  { path: 'materia', component: ThemedComponent },
  { path: 'menu-recurso', component: ResourceMenuComponent },
  { path: 'video', component: ResourceVideoComponent },
  { path: 'actividad', component: ResourceActividadComponent },
  { path: 'libro', component: ResouceLibroComponent },
  { path: 'recursos', component: ResourceFullComponent },
  { path: 'menu-subir', component: UploadMenuComponent },
  { path: 'subir-video', component: UploadVideoComponent },
  { path: 'subir-libro', component: UploadLibroComponent },
  { path: 'subir-actiidad', component: UploadActividadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'colecciones', component:PublicasColeccionesComponent},
  { path: 'privadasColecciones', component:PrivadasColeccionesComponent},
  { path: 'cuenta-usuario', component:CuentaUsuarioComponent},

  { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/home' }

];

