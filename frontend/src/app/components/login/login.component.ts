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
      next: response => {
        if (response.role === 'admin') {
          sessionStorage.setItem('userId', response.userId);
          this.router.navigate(['/stadiums']);
        } else if (response.role === 'alumno') {
          sessionStorage.setItem('userId', response.userId);
          this.router.navigate(['/main']);
        }
      },
      error: error => {
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