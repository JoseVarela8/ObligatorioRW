import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css'],
  animations: [
    trigger('toggleAnimation', [
      state('true', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('false', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('false <=> true', [animate('0.3s ease-in-out')]),
    ])
  ]
})
export class AdministratorComponent implements OnInit {
  matches: any[] = [];
  results: any[] = [];
  teams: string[] = [];
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
    this.getResults();
    this.getTeams();
  }

  toggleSection(section: keyof typeof this.sectionVisible): void {
    this.sectionVisible[section] = !this.sectionVisible[section];
  }

  getMatches(): void {
    this.http.get<any[]>('http://localhost:3000/partidos').subscribe({
      next: data => {
        this.matches = data.map(match => ({
          id_partido: match.id_partido,
          date: `Fecha: ${new Date(match.fecha).toLocaleDateString()} - ${new Date(match.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          group: match.fase,
          team1: { name: match.equipo1 || 'Desconocido', flag: this.flagUrls[match.equipo1] || this.flagUrls['Desconocido'], score: '-', selected: !!match.equipo1 },
          team2: { name: match.equipo2 || 'Desconocido', flag: this.flagUrls[match.equipo2] || this.flagUrls['Desconocido'], score: '-', selected: !!match.equipo2 },
          stadium: match.nombre_estadio,
          resultEntered: false
        }));
        this.updateMatchesWithResults();
      },
      error: error => {
        console.error('Error fetching matches data:', error);
      }
    });
  }

  getResults(): void {
    this.http.get<any[]>('http://localhost:3000/resultados').subscribe({
      next: data => {
        this.results = data;
        this.updateMatchesWithResults();
      },
      error: error => {
        console.error('Error fetching results data:', error);
      }
    });
  }

  getTeams(): void {
    this.http.get<any[]>('http://localhost:3000/equipos').subscribe({
      next: data => {
        this.teams = data.map(team => team.nombre_equipo);
      },
      error: error => {
        console.error('Error fetching teams data:', error);
      }
    });
  }

  selectTeam(match: any, event: Event, teamNumber: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const team = selectElement.value;
    
    if (teamNumber === 1) {
      match.team1.name = team;
      match.team1.flag = this.flagUrls[team];
      match.team1.selected = true;
    } else {
      match.team2.name = team;
      match.team2.flag = this.flagUrls[team];
      match.team2.selected = true;
    }

    if (match.team1.selected && match.team2.selected) {
      this.updateTeams(match.id_partido, match.team1.name, match.team2.name);
    }
  }

  updateTeams(id_partido: number, equipo1: string, equipo2: string): void {
    this.http.post('http://localhost:3000/update-teams', { id_partido, equipo1, equipo2 }).subscribe({
      next: (response: any) => {
        alert('Equipos actualizados correctamente.');
      },
      error: error => {
        console.error('Error updating teams:', error);
        alert('Hubo un error al actualizar los equipos. Por favor, inténtalo de nuevo.');
      }
    });
  }

  updateMatchesWithResults(): void {
    if (this.matches.length > 0 && this.results.length > 0) {
      this.results.forEach(result => {
        const match = this.matches.find(m => m.id_partido === result.id_partido);
        if (match) {
          match.team1.score = result.goles_equipo1;
          match.team2.score = result.goles_equipo2;
          match.resultEntered = true;
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

  submitResult(match: any): void {
    const result = {
      id_partido: match.id_partido,
      goles_equipo1: match.team1.score,
      goles_equipo2: match.team2.score,
      ganador: '-'
    };
  
    if (result.goles_equipo1 > result.goles_equipo2) {
      result.ganador = match.team1.name;
    } else if (result.goles_equipo1 < result.goles_equipo2) {
      result.ganador = match.team2.name;
    } else {
      result.ganador = 'Empate';
    }
  
    this.http.post('http://localhost:3000/resultados', result, { responseType: 'json' }).subscribe({
      next: (response: any) => {
        if (response.message === 'Result updated successfully') {
          alert('Resultado actualizado.');
        } else {
          alert('Resultado ingresado con éxito.');
        }
        match.resultEntered = true;
      },
      error: error => {
        console.error('Error submitting result:', error);
        alert('Hubo un error al ingresar el resultado. Por favor, inténtalo de nuevo.');
      }
    });
  }
}