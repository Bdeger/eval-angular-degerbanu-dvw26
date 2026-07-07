import { Routes } from '@angular/router';
import { Accueil } from './pages/accueil/accueil';
import { Connexion } from './pages/connexion/connexion';
import { Page404 } from './pages/page404/page404';

export const routes: Routes = [
  { path: 'accueil', component: Accueil },
  { path: 'connexion', component: Connexion },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', component: Page404 },
];
