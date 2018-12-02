import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {
  
  constructor(private http: HttpClient) { 
    
  }

  public getJSON(url : string): Observable<any> {
    return this.http.get(url);

  }
}