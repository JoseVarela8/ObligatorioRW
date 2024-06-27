import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
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
    'Venezuela': 'assets/venezuela.png',
    'Desconocido': 'assets/desconocido.png'
  };

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getMatches();
  }

  getMatches(): void {
    const alumnoId = Number(sessionStorage.getItem('alumnoId'));
    if (alumnoId) {
      this.http.get<any[]>(`http://localhost:3000/partidos-con-resultados/${alumnoId}`).subscribe({
        next: data => {
          this.matches = data.map(match => ({
            id_partido: match.id_partido,
            date: `Fecha: ${new Date(match.fecha).toLocaleDateString()} - ${new Date(match.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            group: match.fase,
            team1: { name: match.equipo1 || 'Desconocido', flag: this.flagUrls[match.equipo1] || this.flagUrls['Desconocido'] },
            team2: { name: match.equipo2 || 'Desconocido', flag: this.flagUrls[match.equipo2] || this.flagUrls['Desconocido'] },
            goles1: match.goles_equipo1,
            goles2: match.goles_equipo2,
            stadium: match.nombre_estadio,
            pred_goles_equ1: match.pred_goles_equ1,
            pred_goles_equ2: match.pred_goles_equ2,
            ganador: match.ganador,
            ganador_pred: match.ganador_pred
          }));
        },
        error: error => {
          console.error('Error fetching matches data:', error);
        }
      });
    } else {
      console.error('Alumno ID not found in session storage.');
    }
  }

  calculatePoints(match: any): number {
    let points = 0;
    if (match.pred_goles_equ1 !== null) {
      if (match.pred_goles_equ1 === match.goles1 && match.pred_goles_equ2 === match.goles2) {
        points += 4; // 4 puntos por acertar los goles
      }
      if (match.ganador_pred === match.ganador) {
        points += 2; // 2 puntos por acertar el ganador o el empate
      }
    }
    return points;
  }
}
