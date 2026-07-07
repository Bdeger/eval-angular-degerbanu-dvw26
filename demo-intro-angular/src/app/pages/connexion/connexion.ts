import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss',
})
export class Connexion {
  formBuilder = inject(FormBuilder);
  httpClient = inject(HttpClient);
  router = inject(Router);

  formulaire = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  onConnexion() {
    if (this.formulaire.valid) {
      this.httpClient
        .post('http://localhost:3000/login', this.formulaire.value, { responseType: 'text' })
        .subscribe({
          next: (jwt) => {
            localStorage.setItem('jwt', jwt);
            this.router.navigate(['/accueil']);
          },
          error: () => alert('Mauvais Login / mot de passe'),
        });
    }
  }
}