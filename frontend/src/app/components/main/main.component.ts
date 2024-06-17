import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
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
          id_partido: match.id_partido,
          date: `Fecha: ${new Date(match.fecha).toLocaleDateString()} a las ${new Date(match.fecha).toLocaleTimeString()}`,
          group: match.fase,
          team1: { name: match.equipo1, flag: this.flagUrls[match.equipo1], score: '-' },
          team2: { name: match.equipo2, flag: this.flagUrls[match.equipo2], score: '-' },
          stadium: match.nombre_estadio,
          predictionEntered: false
        }));
      },
      error: error => {
        console.error('Error fetching matches data:', error);
      }
    });
  }

  increaseScore(team: any): void {
    if (team.score === '-') {
      team.score = 0;
    }
    team.score++;
  }

  decreaseScore(team: any): void {
    if (team.score > 0) {
      team.score--;
    } else {
      team.score = '-';
    }
  }

  isValidPrediction(match: any): boolean {
    return match.team1.score >= 0 && match.team2.score >= 0;
  }

  submitPrediction(match: any): void {
    const prediction = {
      id_partido: match.id_partido,
      pred_goles_equ1: match.team1.score,
      pred_goles_equ2: match.team2.score,
      id_alumno: 1 // Debes reemplazar esto con el ID del alumno actual
    };
  
    this.http.post('http://localhost:3000/predicciones', prediction, { responseType: 'json' }).subscribe({
      next: (response: any) => {
        if (response.message === 'Prediction updated successfully') {
          alert('Predicción actualizada.');
        } else {
          alert('Predicción ingresada con éxito.');
        }
        // match.predictionEntered = true;
      },
      error: error => {
        console.error('Error submitting prediction:', error);
        alert('Hubo un error al ingresar la predicción. Por favor, inténtalo de nuevo.');
      }
    });
  }  
}
