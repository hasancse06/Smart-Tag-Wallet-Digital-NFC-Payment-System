import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { CommonfunctionService } from 'src/app/services/commonfunction.service';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Troubleshoot',
      url: '/troubleshoot',
      icon: 'settings'
    },
  ];

  disconnectSubscription: any;
  connectSubscription: any;
  firstTime: boolean = true;
  
  currentUserDisplayName: any;
  private subsCription: Subscription
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private CFS: CommonfunctionService,
    private router: Router,
    private storage: Storage,
    private network: Network,
  ) {
    this.initializeApp();
    // subscribe to home component messages
    this.subsCription = this.CFS.getDisplayName().subscribe( displayName => {
      if (displayName) {
        this.currentUserDisplayName = displayName;
        //console.log('Current Display Name: ', this.currentUserDisplayName);
      } else {
        // clear messages when empty message received
        this.currentUserDisplayName = '';
      }
    });
    if(localStorage.getItem('display_name')){
      this.currentUserDisplayName = {
        'display_name': localStorage.getItem('display_name')
      }
    }
  }

  initializeApp() {
    //this.firstTime = true;
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.checkInternetConnection();
    });
  }

  checkInternetConnection(){
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      if(this.firstTime == false) {
        //console.log('network was connected: ', this.connectSubscription);
        this.CFS.presentAlert('Congrats!','Connection reinstated.');
      }
      this.firstTime = false;
    });
    
    this.disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
      this.firstTime = false;
      //console.log('network was disconnected: ', this.disconnectSubscription);
      this.CFS.presentAlert('Oops!','Bad connection detected.');
      });
  }

  ngOnInit() {

  }

  logOut(){
    localStorage.clear();
    this.storage.clear();
    this.router.navigateByUrl('/login');
      setTimeout(() => {
        //console.log("I left checkout page 1 sec ago");
        window.location.reload();
      }, 1000);
  }
}
