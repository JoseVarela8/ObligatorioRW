import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {


  matches = [
    {
      date: 'Fecha: 20 de Junio a las 21:00',
      group: 'Grupo A',
      team1: { name: 'Argentina', flag: '../../../assets/argentina.png', score: '-' },
      team2: { name: 'Canada', flag: '../../../assets/canada.png', score: '-' }
    },
    // Agrega más partidos aquí
  ];

  constructor() { }

  ngOnInit(): void {
  }

  increaseScore(team: any): void {
    if (team.score === '-') {
      team.score = 1;
    } else {
      team.score++;
    }
  }

  decreaseScore(team: any): void {
    if (team.score > 0) {
      team.score--;
    } else {
      team.score = '-';
    }
  }
}

