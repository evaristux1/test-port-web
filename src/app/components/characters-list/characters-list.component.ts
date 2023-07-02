import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HarryPotterService } from '../../harry-potter.service';
import { Character } from 'src/models/character.model';
import { HttpClientConfig } from 'src/config/http-client.config';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.css'],
  providers: [HttpClientConfig]
})
export class CharactersListComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  isLoading: boolean = true;
  subscription: Subscription | undefined;

  constructor(private harryPotterService: HarryPotterService, private httpClientConfig: HttpClientConfig) { }

  ngOnInit() {
    this.subscription = this.harryPotterService.getAllCharacters().subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this),
      complete: () => this.isLoading = false
    });
  }

  likeCharacter(character: Character) {
    const token = localStorage.getItem('token');
    if (!token) {
      const email = prompt('Digite seu email:');
      if (!email) {
        console.error('Email não fornecido');
        return;
      }

      const requestPayload = { email: email };

      this.httpClientConfig.post('auth/generate', requestPayload).subscribe({
        next: (response: any) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.executeLikeCharacterRequest(character, token);
        },
      });

    } else {

      this.executeLikeCharacterRequest(character, token);
    }
  }

  private executeLikeCharacterRequest(character: Character, token: string) {
    const requestPayload = {};
    this.httpClientConfig.post(`characters/${character.id}/like`, requestPayload).subscribe({
      next: (response: any) => {
        window.alert("Personagem curtido com sucesso!")
        console.log("🚀 ~ file: characters-list.component.ts:57 ~ CharactersListComponent ~ this.httpClientConfig.post ~ (response:", response);

      },
      error: (error) => console.error('Erro ao curtir:', error),
    }
    );
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleUpdateResponse(response: Object) {
    this.characters = response as Character[];
  }

  handleError(error: any) {
    console.error('Error fetching characters:', error);
  }
}
