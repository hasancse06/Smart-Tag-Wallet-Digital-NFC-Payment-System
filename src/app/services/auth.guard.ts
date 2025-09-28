import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonfunctionService } from './commonfunction.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{

  constructor(
    private authService: AuthService, 
    private router: Router,
    private CFS: CommonfunctionService
    ){
  
    }

    canActivate(route, state: RouterStateSnapshot) {
      if(!this.authService.isUserLoggedIn){
        this.CFS.presentAlert('Opps!','You have to login first to view this page!');
        this.router.navigateByUrl('/login');
          return false;
      } else {
        return true;
      }
    }  
}
