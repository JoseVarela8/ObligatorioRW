import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  matches: any[] = [];
  flagUrls: { [key: string]: string } = {
    'Argentina': 'assets/argentina.png',
    'Bolivia': 'assets/bolivia.png',
    'Brasil': 'assets/brasil.png',
    'Canada': 'assets/canada.png',
    'Chile': 'assets/chile.png',
    'Colombia': 'assets/colombia.png',
    'Costa Rica': 'assets/costa_rica.png',
    'Ecuador': 'assets/ecuador.png',
    'Estados Unidos': 'assets/estados_unidos.png',
    'Jamaica': 'assets/jamaica.png',
    'Mexico': 'assets/mexico.png',
    'Panama': 'assets/panama.png',
    'Paraguay': 'assets/paraguay.png',
    'Peru': 'assets/peru.png',
    'Uruguay': 'assets/uruguay.png',
    'Venezuela': 'assets/venezuela.png'
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getMatches();
  }

  getMatches(): void {
    this.http.get<any[]>('http://localhost:3000/partidos').subscribe({
      next: data => {
        this.matches = data.map(match => ({
          date: `Fecha: ${new Date(match.fecha).toLocaleDateString()} a las ${new Date(match.fecha).toLocaleTimeString()}`,
          group: match.fase,
          team1: { name: match.equipo1, flag: this.flagUrls[match.equipo1], score: '-' },
          team2: { name: match.equipo2, flag: this.flagUrls[match.equipo2], score: '-' },
          stadium: match.nombre_estadio
        }));
      },
      error: error => {
        console.error('Error fetching matches data:', error);
      }
    });
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
