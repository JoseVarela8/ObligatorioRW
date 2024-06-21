import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  username: string | null = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
  }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
