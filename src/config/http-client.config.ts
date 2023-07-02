import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpClientConfig {
  private baseUrl: string = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

  private getAuthorizationHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    } else {
      return new HttpHeaders();
    }
  }

  public get(url: string) {
    const headers = this.getAuthorizationHeaders();
    return this.httpClient.get(`${this.baseUrl}/${url}`, { headers });
  }

  public post(url: string, body: any) {
    const headers = this.getAuthorizationHeaders();
    return this.httpClient.post(`${this.baseUrl}/${url}`, body, { headers });
  }
}
