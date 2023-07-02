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
    const token = sessionStorage.getItem('token');
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
          sessionStorage.setItem('token', token);
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

      },
      error: (error) => {
        window.alert("Houve um erro ao curtir, tente novamente!")
        sessionStorage.clear();
      },
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
