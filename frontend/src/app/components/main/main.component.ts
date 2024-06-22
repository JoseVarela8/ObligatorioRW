import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Console } from 'console';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('toggleAnimation', [
      state('true', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('false', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('false <=> true', [animate('0.3s ease-in-out')]),
    ])
  ]
})
export class MainComponent implements OnInit {
  matches: any[] = [];
  predictions: any[] = [];
  sectionVisible: { [key: string]: boolean } = {
    faseDeGrupos: true,
    cuartos: false,
    semifinal: false,
    final: false
  };
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
    'Venezuela': 'assets/venezuela.png',
    'Desconocido': 'assets/desconocido.png'
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getMatches();
    this.getPredictions();
  }

  toggleSection(section: keyof typeof this.sectionVisible): void {
    this.sectionVisible[section] = !this.sectionVisible[section];
  }
  getMatches(): void {
    this.http.get<any[]>('http://localhost:3000/partidos').subscribe({
      next: data => {
        this.matches = data.map(match => ({
          id_partido: match.id_partido,
          date: `Fecha: ${new Date(match.fecha).toLocaleDateString()} a las ${new Date(match.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          group: match.fase,
          team1: { name: match.equipo1 || 'Desconocido', flag: this.flagUrls[match.equipo1] || this.flagUrls['Desconocido'], score: '-' },
          team2: { name: match.equipo2 || 'Desconocido', flag: this.flagUrls[match.equipo2] || this.flagUrls['Desconocido'], score: '-' },
          stadium: match.nombre_estadio,
          predictionEntered: false
        }));
        this.updateMatchesWithPredictions();
      },
      error: error => {
        console.error('Error fetching matches data:', error);
      }
    });
  }  


  getPredictions(): void {
    const alumnoId = Number(sessionStorage.getItem('alumnoId'));
    if (alumnoId) {
      this.http.get<any[]>(`http://localhost:3000/predicciones/${alumnoId}`).subscribe({
        next: data => {
          this.predictions = data;
          this.updateMatchesWithPredictions();
        },
        error: error => {
          console.error('Error fetching predictions data:', error);
        }
      });
    } else {
      console.error('Alumno ID not found in session storage.');
    }
  }

  updateMatchesWithPredictions(): void {
    if (this.matches.length > 0 && this.predictions.length > 0) {
      this.predictions.forEach(prediction => {
        const match = this.matches.find(m => m.id_partido === prediction.id_partido);
        if (match) {
          match.team1.score = prediction.pred_goles_equ1;
          match.team2.score = prediction.pred_goles_equ2;
          match.predictionEntered = true;
        }
      });
    }
  }

  increaseScore(team: any): void {
    if (team.score === '-') {
      team.score = 0;
    }
    else{
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

  isValidPrediction(match: any): boolean {
    return match.team1.score !== '-' && match.team2.score !== '-'
  }

  submitPrediction(match: any): void {
    const alumnoId = Number(sessionStorage.getItem('alumnoId'));
    if (!alumnoId) {
      alert('Alumno ID not found. Please log in again.');
      return;
    }
    const prediction = {
      id_partido: match.id_partido,
      pred_goles_equ1: match.team1.score,
      pred_goles_equ2: match.team2.score,
      ganador_pred: this.getWinner(match.team1, match.team2),
      id_alumno: alumnoId
    };
  
    this.http.post('http://localhost:3000/predicciones', prediction, { responseType: 'json' }).subscribe({
      next: (response: any) => {
        if (response.message === 'Prediction updated successfully') {
          alert('Predicción actualizada.');
        } else {
          alert('Predicción ingresada con éxito.');
        }
        match.predictionEntered = true;
      },
      error: error => {
        console.error('Error submitting prediction:', error);
        alert('Hubo un error al ingresar la predicción. Por favor, inténtalo de nuevo.');
      }
    });
  }  
  getWinner(team1: any, team2: any): string {
    if (team1.score > team2.score) {
      return team1.name;
    } else if (team1.score < team2.score) {
      return team2.name;
    } else {
      return 'Empate';
    }
  }
}
