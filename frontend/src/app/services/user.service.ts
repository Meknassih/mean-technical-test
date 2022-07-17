import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _jwt: string | null;
  public get jwt(): string | null {
    return this._jwt;
  }
  private _name: string | null;
  public get name(): string | null {
    return this._name;
  }

  constructor(private http: HttpClient) {
    this._jwt = localStorage.getItem("jwt");
    this._name = localStorage.getItem("username");
  }

  login(name: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiURL}/users`, {
      name,
      password
    }).pipe(tap(result => {
      localStorage.setItem("jwt", result.jwt)
      localStorage.setItem("username", name)
      this._jwt = result.jwt;
      this._name = name;
    }))
  }

  isLoggedIn(): boolean {
    return !!this._jwt;
  }

  logout(): void {
    // JWTs cannot be revoked so we only logout client-wise
    localStorage.removeItem("jwt")
    localStorage.removeItem("username")
    this._jwt = null;
    this._name = null;
  }
}

type LoginResponse = {
  jwt: string
}