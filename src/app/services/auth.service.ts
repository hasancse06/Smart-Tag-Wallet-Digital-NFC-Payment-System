import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserData: any;
  currentSessionUser: any;
  isUserAthenticated: boolean = false;
  isUserPassChanged: boolean = false;
  wooComUserData: any;
  apiUrl: string;
  siteURL = 'https://demo.hasan.online/github';
  jwtPart = '/wp-json/jwt-auth/v1/token';

  constructor(
    private http: HttpClient
    ) { }

  login(email, password){
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    let credentials = `username=${email}&password=${password}`;
    this.apiUrl = this.siteURL + this.jwtPart;
    //console.log('API URL for login: ', this.apiUrl);
    return new Promise ((resolve, reject) => {
      this.http.post(this.apiUrl, credentials, { headers }).subscribe( 
        response => {
        // for auth guard check
        this.isUserAthenticated = true;
        //this.isUserLoggedIn;
        resolve(response);
      },
      error => {
        resolve(error);
      }
      );
    }); 
  }

  // for auth guard
  get isUserLoggedIn() {
    //localStorage.clear();
    /***the purpose of this code block is keep login persist even after refresh ***/
    this.currentSessionUser = localStorage.getItem('currentUserId');
    if(this.currentSessionUser){
      this.isUserAthenticated = true;
    } else {
      this.isUserAthenticated = false;
    }
    /*** otherwise refresh will set isUserAthenticated false ***/
    //console.log('Is user found in local Storage: ', this.currentSessionUser);
  // console.log('isUserAthenticated: ', this.isUserAthenticated);
    return this.isUserAthenticated;
  }

}
