import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  dni: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';

  onSubmit() {
    // Aquí puedes añadir la lógica para el registro, por ejemplo, hacer una llamada a una API
    console.log('DNI:', this.dni);
    console.log('First Name:', this.firstName);
    console.log('Last Name:', this.lastName);
    console.log('Password:', this.password);
    // Añade aquí la lógica para validar y manejar el registro
  }
}
