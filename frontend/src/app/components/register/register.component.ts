import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  selectedCarrera: number = 0;
  pred_champ: string = '';
  pred_subchamp: string = '';
  carreras: any[] = [];
  equipos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCarreras();
    this.loadEquipos();
  }

  loadCarreras() {
    this.http.get<any[]>('http://localhost:3000/carreras').subscribe((data: any[]) => {
      this.carreras = data;
    });
  }

  loadEquipos() {
    this.http.get<any[]>('http://localhost:3000/equipos').subscribe((data: any[]) => {
      this.equipos = data;
    });
  }

  onSubmit() {
    const alumnoData = {
      username: this.username,
      email: this.email,
      password: this.password,
      id_carrera: this.selectedCarrera,
      pred_champ: this.pred_champ,
      pred_subchamp: this.pred_subchamp
    };

    this.http.post<any>('http://localhost:3000/register', alumnoData).subscribe({
      next: (response: any) => {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        if (error.status === 409) {
          alert('Correo electrónico ya registrado');
        } else {
          console.error('Error durante el registro:', error);
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
