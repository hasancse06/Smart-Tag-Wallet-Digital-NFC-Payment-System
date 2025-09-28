import { Component, OnInit} from '@angular/core';
import { CommonfunctionService } from '../services/commonfunction.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  tagid: any;
  tagdesc: any;
  userRole;

  constructor(
    private storage: Storage,
    private CFS: CommonfunctionService,
    private nfc: NFC,
    private platform: Platform
    ) {
      //this.storage.clear();
      //localStorage.clear();
    }

    ionViewWillEnter(){
      this.userRole = localStorage.getItem('userRole');
       //console.log('Current user role: ', this.userRole);
    }

    ngOnInit(){
      
    }

    reloadPWA(){
      window.location.reload();
    }
}
