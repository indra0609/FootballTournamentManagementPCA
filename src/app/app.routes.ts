import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  
  { path: 'teams', loadComponent: () => import('./pages/teams/teams.component').then(m => m.TeamsComponent) },
  { path: 'teams/:id', loadComponent: () => import('./pages/team-details/team-details.component').then(m => m.TeamDetailsComponent) },

  { path: 'matches', loadComponent: () => import('./pages/matches/matches.component').then(m => m.MatchesComponent) },
  { path: 'matches/:id', loadComponent: () => import('./pages/match-details/match-details.component').then(m => m.MatchDetailsComponent) },

  { path: 'admin-login', loadComponent: () => import('./pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin', canActivate: [adminGuard], loadComponent: () => import('./pages/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent) },

  { path: '**', redirectTo: '' }
];
