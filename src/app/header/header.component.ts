import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userInfo: { tipocuenta: string, username: string } | null = null;
  private destroy$ = new Subject<void>();
  showOptions = false;

  activeLinkIndex = 0;
  links = [
    { path: '/home', label: 'Inicio', active: true },
    { path: '/colecciones', label: 'Colecciones', active: false },
    { path: '/nivel', label: 'Categoria', active: false },
    { path: '/recursos', label: 'Recursos', active: false },
    { path: '/menu-subir', label: 'Subir Recursos', active: false },
    { path: '/privadasColecciones', label: 'Mis colecciones', active: false },
    { path: '/login', label: 'Usuario', active: false },
    { path: '/cuenta-usuario',label:'Cuenta',active:false},
    { path: '/cuenta-usuario',label:'Cuenta',active:false},

    // { path: '/menu-recurso', label: 'Contactanos', active: false },
  ];

  constructor(private router: Router,private apiService: ApiService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    this.apiService.getUserInfo().subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    this.getUserInfo();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveLink(index: number) {
    this.activeLinkIndex = index;
    this.links.forEach((link, i) => link.active = i === index);
  }

  isActiveLink(index: number): boolean {
    return this.activeLinkIndex === index;
  }

  // ir a la pagina de login --- Maria
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  getUserInfo() {
    this.userInfo = this.apiService.getUserInfoFromToken();
    console.log('UserInfo:', this.userInfo); // Verificar en la consola
    //this.cd.detectChanges();
  }
  logout() {
    this.userInfo = null;
    this.apiService.logout();
    this.router.navigate(['/home']); // Navega a la página de inicio o login después de cerrar sesión
    this.showOptions = false;
  }
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  anotherOption() {
    // Lógica para otra opción
    console.log('Otra opción');
    this.showOptions = false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    // Cierra las opciones si se hace clic fuera del botón y las opciones
    const target = event.target as HTMLElement;
    if (!target.closest('.fa-sign-out-alt') && !target.closest('.options-container')) {
      this.showOptions = false;
    }
  }
}  
//--------------------------------
