import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Store only in memory for added security
  private _jwt: string;

  constructor(private http: HttpClient) {
    this._jwt = "NOT_AUTHENTICATED";
  }

  login(name: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiURL}/users`, {
      name,
      password
    }).pipe(tap(result => this._jwt = result.jwt))
  }
}

type LoginResponse = {
  jwt: string
}