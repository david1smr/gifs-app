import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'LPkbQ0Hs2SDqu8jfPadF7RzYRCU13cr0';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  private _history: string[] = [];

  public resutls: Gif[] = [];

  get historial() {
    return [...this._history]
  }

  constructor(private http : HttpClient) {
    this._history = JSON.parse(localStorage.getItem('searchHistory')!) || [];
    this.resutls = JSON.parse(localStorage.getItem('results')!) || [];
  }

  searchGifs(query:string) {

    query = query.trim().toLowerCase();
    
    if (!this._history.includes(query)) {
      this._history.unshift(query);
      this._history = this._history.splice(0,10);

      localStorage.setItem('searchHistory', JSON.stringify(this._history));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.serviceUrl}/search`, { params: params})
      .subscribe((resp: any) => {
        this.resutls = resp.data;
        localStorage.setItem('results', JSON.stringify(this.resutls));
      })
  }

}
