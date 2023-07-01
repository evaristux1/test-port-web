import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HarryPotterService } from '../../harry-potter.service';
import { Character } from 'src/models/character.model';

@Component({
  selector: 'app-characters-list',
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.css']
})
export class CharactersListComponent implements OnInit, OnDestroy {
  characters: Character[] = []; // Use a interface Character como tipo para characters
  subscription: Subscription | undefined;

  constructor(private harryPotterService: HarryPotterService) { }

  ngOnInit() {
    this.subscription = this.harryPotterService.getAllCharacters().subscribe({
      next: this.handleUpdateResponse.bind(this),
      error: this.handleError.bind(this)
    });
  }

  likeCharacter(character: Character) { // Use a interface Character como tipo para character
    console.log('Filme curtido:', character.name);
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
