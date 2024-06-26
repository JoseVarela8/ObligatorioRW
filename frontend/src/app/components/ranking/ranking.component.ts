import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})
export class RankingComponent implements OnInit {

  ranking: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRanking();
  }

  getRanking(): void {
    this.http.get<any[]>('http://localhost:3000/ranking').subscribe({
      next: data => {
        this.ranking = data;
      },
      error: error => {
        console.error('Error fetching ranking:', error);
      }
    });
  }

}
