import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StadiumsComponent } from './components/stadiums/stadiums.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { TeamsComponent } from './components/teams/teams.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { PrizeComponent } from './components/prize/prize.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'prize', component: PrizeComponent },
  { path: 'results', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }