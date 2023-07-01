import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HarryPotterService {

  constructor(private http: HttpClient) { }

  getAllCharacters() {
    const url = `https://hp-api.onrender.com/api/characters`;
    return this.http.get(url);
  }
}
