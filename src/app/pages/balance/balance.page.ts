import { Component, OnInit } from '@angular/core';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { CommonfunctionService } from 'src/app/services/commonfunction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.page.html',
  styleUrls: ['./balance.page.scss'],
})
export class BalancePage implements OnInit {

  tagid: any;
  tagUserId: any;
  tagUserName: any;
  

  spinner: boolean = false;
  NFCInitialised: boolean = false;
  NFCNotInitialised: boolean = false;
  walletBalance: any;
  balanceUserData: any;
  balanceUserId: any;
  accessToken: any;

  constructor(
    private WL: WalletService,
    private CFS: CommonfunctionService,
    private nfc: NFC,

    ) { 
      this.accessToken = localStorage.getItem('access_token');
    }

  ionViewWillEnter(){
    this.nfc.addNdefListener(() => {
      this.CFS.presentToast('NFC Initialised','bottom',1000);
      this.NFCInitialised = true;
      this.NFCNotInitialised = false;
      //console.log('successfully attached ndef listener');
    }, async (err) => {
      this.NFCInitialised = false;
      this.NFCNotInitialised = true;
      //console.log('error attaching ndef listener', err)
  
    }).subscribe(async (event) => {
      //console.log('received ndef message. the tag contains: ', event.tag);
      //console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
      this.tagid = null;
      this.tagUserId = null;
      let tagId = await this.nfc.bytesToHexString(event.tag.id);
      this.tagid = tagId;
      //console.log('tagId: ', this.tagid);
      let payload = event.tag.ndefMessage[0].payload;
      //console.log('payload: ',payload);
      let tagContent = await this.nfc.bytesToString(payload).substring(3);
       //console.log('tagContent: ',tagContent);
       this.tagUserName = tagContent;
       //console.log('tagdesc: ',this.tagdesc);
       if(this.tagUserName) {
        this.spinner = true;
        this.WL.getUserIdByUsername(this.tagUserName).then((data) => {
          this.balanceUserData = data;
            //console.log('User data: ', this.topUpUserData);
            this.tagUserId = this.balanceUserData.userId;
            this.balanceUserId = this.tagUserId;
            //console.log('User Id: ', this.topUpUserId);
            this.spinner = false;
            this.getCurrentBalance();
            this.CFS.presentToast('Scan Successful','bottom',1000);
        });
     } else {
      this.CFS.presentAlert('Error!','No ID Found in your Tag/Card');
     }
    });
  }

  ngOnInit() {
  
  }

  getCurrentBalance(){
    //console.log('getCurrentBalance called, balanceUserId is: ', this.balanceUserId);
    this.spinner = true;
    this.WL.getWalletBalance(this.balanceUserId,this.accessToken).subscribe((data)=>{
      this.walletBalance = data;
      //console.log('Current user wallet balance:',this.walletBalance);
      this.spinner = false;
    });
  }

  ionViewDidLeave() {
    //this.navCtrl.pop();
    setTimeout(() => {
      window.location.reload();
    },500);
    //console.log("Looks like I'm about to leave :(");
  }


  doRefresh(event) {
    //console.log('Begin async operation');
    this.getCurrentBalance();
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  reloadPWA(){
    window.location.reload();
  }

}
