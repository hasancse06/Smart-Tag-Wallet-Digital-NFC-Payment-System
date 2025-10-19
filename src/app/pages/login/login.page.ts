import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonfunctionService } from 'src/app/services/commonfunction.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { WalletService } from 'src/app/services/wallet.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  currentUserData: any;
  email = '';
  password = '';
  spinner: boolean = false;
  disableBtn: boolean = false;
  deviceOffline: boolean = false;
  userData: any;
  currentUserId: any;

  scannedData: any;
  scanSpinner: boolean = false;
  qrSignIn: boolean = false;

  siteURL: any;

  constructor(
    private platform: Platform,
    private auth: AuthService,
    private WL: WalletService,
    private CFS: CommonfunctionService,
    private router: Router,
    private barcodeScanner: BarcodeScanner
  ) { 

  }

  ionViewWillEnter(){
    if(localStorage.getItem('currentUserId')) {
      this.CFS.presentToast('You are logged in...!','bottom',2000);
      this.router.navigateByUrl('/home');
    }
  }

  ngOnInit() {

  }

  scanNow() {
    this.scanSpinner = true;
    this.disableBtn = true;
    const options: BarcodeScannerOptions = {
      showTorchButton: true,
      prompt: 'Place QR Code inside the scan area',
    };
    this.barcodeScanner.scan(options).then(barcodeData => {
      //console.log('Barcode data scanForEntry: ', barcodeData);
      this.scannedData = barcodeData;
      let scannedText = this.scannedData.text;
      //console.log('scannedText from scan: ', scannedText);
      let email = scannedText.split(':split:').shift();
      this.email = email.trim().toLowerCase();
      let password = scannedText.split(':split:').pop();
      this.password = password.trim();
      //console.log('Email after split: ', this.email);
      //console.log('Password after split: ', this.password);
      if(this.email && this.password){
        this.qrSignIn = true;
        this.scanSpinner = false;
        this.signIn();
      }
      if(this.scannedData.cancelled){
        this.scanSpinner = false;
        this.disableBtn = false;
        this.CFS.presentToast('You cancelled the scan!','bottom',2000);
      }
      if(this.email && this.password){
          this.signIn();
          this.scanSpinner = false;
      }
    }).catch(err => {
      //console.log('Error', err);
      this.scanSpinner = false;
      this.disableBtn = false;
    });
  } 

  signIn(){
    this.platform.ready().then(() => {
      this.spinner = true;
      this.disableBtn = true;
      if((this.CFS.validateEmail(this.email)) && (this.password) != ''){
        this.auth.login(this.email, this.password).then(responseData => {
          //console.log('Login Response:', responseData);
          if(responseData['token']){
            //console.log('Login Response:', responseData);

            // CUSTOM HACK decode current user ID from token
            let jwt = responseData['token'];
            let jwtData = jwt.split('.')[1];
            let decodedJwtJsonData = window.atob(jwtData);
            let decodedJwtData = JSON.parse(decodedJwtJsonData);
            let currentUserId = decodedJwtData.data.user['id'];
            this.WL.getUserDataForLogin(currentUserId, this.email).then((data) => {
              this.currentUserData = data;
              //console.log('Current User Role: ',this.currentUserData);
              if(this.currentUserData.userRole == "administrator" || this.currentUserData.userRole == "shop_manager") {
                this.CFS.presentToast('You are logged in...!', 'bottom', 2000);
                localStorage.setItem('currentUserEmail', this.email.toLowerCase());
                localStorage.setItem('access_token', responseData['token']);
                localStorage.setItem('display_name', responseData['user_display_name']);
                localStorage.setItem('currentUserId', currentUserId);
                localStorage.setItem('userRole', this.currentUserData.userRole);
                this.CFS.setDisplayName(responseData['user_display_name']);
                //console.log('I am: ',this.currentUserData.userRole);
                setTimeout(() => {
                  window.location.reload();
                },500);
                this.router.navigateByUrl('/home');
              } else {
                this.CFS.presentAlert('Oops!','You are not authorised to use this system!');
                this.disableBtn = false;
                this.spinner = false;
              }
          });

          } else {
            this.CFS.presentToast(
              'Your Email or Password is not right..!',
              'bottom',
              3000
            );
            this.spinner = false;
            this.disableBtn = false;
          }
        });
      } else {
        this.CFS.presentToast (
          'Please enter email and password properly',
          'bottom',
          3000
        );
        this.spinner = false;
        this.disableBtn = false;
      }
    });
  }

  reloadPWA(){
    window.location.reload();
  }

}

