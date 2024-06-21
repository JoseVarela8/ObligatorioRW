import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router){}

  ngOnInit(): void {

  } 

  onSubmit() {
    this.http.post<any>('http://localhost:3000/login', { username: this.username, password: this.password }).subscribe({
      next: (response: { role: string; userId: string; alumnoId?: number }) => {
        sessionStorage.setItem('userId', response.userId);
        sessionStorage.setItem('username', this.username);
        if (response.role === 'alumno' && response.alumnoId) {
          sessionStorage.setItem('alumnoId', response.alumnoId.toString());
          this.router.navigate(['/main']);
        } else if (response.role === 'admin') {
          this.router.navigate(['/administrator']);
        }
      },
      error: (error: { status: number }) => {
        if (error.status === 401) {
          alert('Usuario o contraseña incorrecta');
        } else {
          console.error('Error during login:', error);
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}