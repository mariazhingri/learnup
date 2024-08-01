import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
//import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private materiasUrl = 'http://localhost:3000/api/materias';
  private actividadesUrl = 'http://localhost:3000/api/actividades';
  private videosUrl = 'http://localhost:3000/api/videos';
  private librosUrl='http://localhost:3000/api/libros';
  private userUrl = 'http://localhost:3000/api';
  private userInfoChanged$ = new Subject<any>();

  constructor(private http: HttpClient) {}

  getMaterias(): Observable<any> {
    return this.http.get<any>(this.materiasUrl);
  }

  getActividades(): Observable<any> {
    return this.http.get<any>(this.actividadesUrl);
  }

  getVideos(): Observable<any> {
    return this.http.get<any>(this.videosUrl);
  }

  getLibros(): Observable<any>{
    return this.http.get<any>(this.librosUrl);
  }

  postActividades(data: any): Observable<any> {
    return this.http.post<any>(this.actividadesUrl, data);
  }

  postVideos(data: any): Observable<any> {
    return this.http.post<any>(this.videosUrl, data);
  }

  postLibros(data: any): Observable<any> {
    return this.http.post<any>(this.librosUrl, data);
  }


  /*---------------MARIA------------------------*/
  postUsers(userData: any): Observable<any> {
    return this.http.post(`${this.userUrl}/users`, userData);
  }

  postUsersLogin(userData: any): Observable<any> {
    return this.http.post(`${this.userUrl}/login`, userData).pipe(
      tap((response: any) => {
        if (response.error) {
          throw new Error(response.error);
        } else if (response.token) {
          localStorage.setItem('token', response.token);
          this.userInfoChanged$.next(this.getUserInfoFromToken());
        }
      })
    );
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userInfoChanged$.next(null);
  }
  getUserInfo(): Observable<any> {
    return this.userInfoChanged$.asObservable();
  }


  getProtectedResource(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get(`${this.userUrl}/protected`, { headers });
  }


  // Método para obtener la información del usuario desde el token JWT
  getUserInfoFromToken(): { id : number,tipocuenta: string, username: string } | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split('.')[1]));

        // // Verificar la expiración del token
        // const currentTimestamp = new Date().getTime() / 50000; // Tiempo actual en segundos
        // if (decoded.exp && decoded.exp < currentTimestamp) {
        //   console.warn('El token ha expirado.');
        //   // Realizar acciones de renovación de token o cierre de sesión aquí si es necesario
        //   return null;
        // }

        return {
          id: decoded.id,
          tipocuenta: decoded.tipocuenta,
          username: decoded.username
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  /*Traer datos de la tabla users desde el backend - maria*/
  getUsers(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.userUrl}/datausers`, { headers });
  }
  /*Atualizar datos de la tabla users*/
  postActualizartabla(userData: any): Observable<any> {
    console.log('Sending request to backend:', userData);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.userUrl}/updateusers`, userData);
  }
  /*Eliminar Cuenta de Usuario*/
  deleteCuenta(id: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.userUrl}/deleteusers/${id}`, { headers });
  }



  /*------------------End Maria-----------------------*/

  /*------------Ivette--------------*/
  crearColeccion(nombre: string, esPrivado: boolean): Observable<any> {
    const body = { nombre, es_privado: esPrivado };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.userUrl}/colecciones`, body, { headers });
  }

  obtenerColecciones(): Observable<{ nombre: string, selected: boolean, coleccion_id: number }[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{ nombre: string, selected: boolean, coleccion_id: number }[]>(`${this.userUrl}/colecciones`, { headers });
  }

  guardarRecursoEnColeccion(resource: any, colecciones: number[]): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.userUrl}/colecciones/guardar-recurso`, { resource, colecciones }, { headers });
  }

  obtenerColeccionesPublicas(): Observable<any> {
    return this.http.get(`${this.userUrl}/colecciones/publicas`);
  }

  obtenerRecursosDeColeccion(coleccionId: number): Observable<any> {
    return this.http.get(`${this.userUrl}/colecciones/${coleccionId}/recursos`);
  }

  obtenerColeccionesPrivadas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.userUrl}/colecciones/privadas`, { headers });
  }

  eliminarColeccion(coleccion_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.userUrl}/colecciones/${coleccion_id}`, {headers});
  }

  eliminarRecursoDeColeccion(coleccion_id: number, recurso_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.userUrl}/colecciones/${coleccion_id}/recurso/${recurso_id}`, {headers});
  }

}
