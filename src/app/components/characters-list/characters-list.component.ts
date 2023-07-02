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
    const characterId = character.id;
    const url = `characters/${characterId}/like`;

    this.httpClientConfig.post(url, {}).subscribe({
      next: () => console.log('Personagem curtido:', character.name),
      error: (error) => console.error('Erro ao curtir personagem:', error)
    });
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
