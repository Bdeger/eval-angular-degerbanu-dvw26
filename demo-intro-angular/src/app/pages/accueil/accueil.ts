import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accueil',
  imports: [FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  nouvelleUrlImage =
    'https://s2.qwant.com/thumbr/474x266/f/b/ad4d78aa76c0c65be16fe233a6aeb2ba6d464a7be6e4234c2e586044830d59/OIP.4IXeglpzpeyzgxRKIH10LAHaEK.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.4IXeglpzpeyzgxRKIH10LAHaEK%3Fpid%3DApi&q=0&b=1&p=0&a=0';

  categories = signal<Categorie[]>([]);
  imageDeplace = signal<{ indexCategorie: number; indexImage: number } | null>(null);

  httpClient = inject(HttpClient);

  ngOnInit() {
    this.chargement();
  }

  private getAuthHeaders(): { [header: string]: string } {
    const jwt = localStorage.getItem('jwt');
    return jwt ? { Authorization: jwt } : {};
  }

  chargement() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.httpClient
        .get('http://localhost:3000/categories', { headers: this.getAuthHeaders() })
        .subscribe((categoriesRenvoyees: any) => {
          this.categories.set(categoriesRenvoyees);
        });
    }
  }

  sauvegarde() {}

  onAjoutImage() {
    if (this.nouvelleUrlImage != '') {
      this.httpClient
        .post(
          'http://localhost:3000/ajout-image',
          { indexCategorie: 0, urlImage: this.nouvelleUrlImage },
          { headers: this.getAuthHeaders() },
        )
        .subscribe({
          next: () => this.chargement(),
          error: (erreur) => {
            if (erreur.status === 409) {
              alert('Cette URL existe déjà dans la tier-list');
            }
            this.chargement();
          },
        });
      this.nouvelleUrlImage = '';
    }
  }

  onSuppressionImage(indexCategorie: number, indexImage: number) {
    this.httpClient
      .post(
        'http://localhost:3000/supprimer-image',
        { indexCategorie, indexImage },
        { headers: this.getAuthHeaders() },
      )
      .subscribe(() => this.chargement());
  }

  onDeplacement(indexCategorie: number, indexImage: number, haut: boolean = true) {
    this.httpClient
      .patch(
        'http://localhost:3000/deplacement-image',
        { indexCategorie, indexImage, haut },
        { headers: this.getAuthHeaders() },
      )
      .subscribe(() => this.chargement());
  }

  onDebutDeplacement(indexCategorie: number, indexImage: number) {
    this.imageDeplace.set({ indexCategorie, indexImage });
  }

  onFinDeplacement(indexCategorieDestination: number) {
    const image = this.imageDeplace();

    if (image === null) return;

    if (image.indexCategorie === indexCategorieDestination) {
      this.imageDeplace.set(null);
      return;
    }

    this.httpClient
      .patch(
        'http://localhost:3000/deplacement-image',
        {
          indexCategorie: image.indexCategorie,
          indexImage: image.indexImage,
          haut: indexCategorieDestination < image.indexCategorie,
        },
        { headers: this.getAuthHeaders() },
      )
      .subscribe(() => {
        this.imageDeplace.set(null);
        this.chargement();
      });
  }
}