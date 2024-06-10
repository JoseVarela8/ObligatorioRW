import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onSubmit() {
    // Aquí puedes añadir la lógica para el inicio de sesión, por ejemplo, hacer una llamada a una API
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    // Añade aquí la lógica para validar y manejar el inicio de sesión
  }
}