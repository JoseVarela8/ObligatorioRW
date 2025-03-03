import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { StadiumsComponent } from './components/stadiums/stadiums.component';
import { TeamsComponent } from './components/teams/teams.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FilterByPhasePipe } from './filter-by-phase.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { PrizeComponent } from './components/prize/prize.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'administrator', component: AdministratorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    HeaderComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    StadiumsComponent,
    TeamsComponent,
    FilterByPhasePipe,
    AdministratorComponent,
    RankingComponent,
    PrizeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    RouterModule.forRoot(routes)  // Asegúrate de usar forRoot para configurar las rutas principales
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())  // Aquí se agrega la configuración de withFetch
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
