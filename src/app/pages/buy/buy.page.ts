import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { CommonfunctionService } from 'src/app/services/commonfunction.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {

  tagid: any;
  tagUserId: any;
  tagUserName: any;
  
  formDisplay: boolean = false;
  disableBtn: boolean = false;
  spinner: boolean = false;
  transactionValidated: boolean = false;
  NFCInitialised: boolean = false;
  NFCNotInitialised: boolean = false

  walletBalance: any;
  showWalletBalance: any;
  walletBalanceSpinner: boolean = false;
  customAmount: any;
  tempAmount = 0;
  amount = 0;
  totalAmount = 0;
  customerUserData: any;
  customerUserId: any;
  accessToken: any;
  salesAgent: any;
  topupStatus: any;

  buyItemObj = {
    userId: '',
    type: '',
    amount: 0,
    details: '',
    token: ''
  };
  
  constructor(
    private WL: WalletService,
    private CFS: CommonfunctionService,
    private router: Router,
    private nfc: NFC
    ) { 
      this.accessToken = localStorage.getItem('access_token');
      this.salesAgent = localStorage.getItem('currentUserEmail');
    }

  ionViewWillEnter(){
    if(localStorage.getItem('userRole') == "topupagent") {
      this.router.navigateByUrl('/home');
    }

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
      this.formDisplay = false;
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
        this.walletBalanceSpinner = true;
        this.WL.getUserIdByUsername(this.tagUserName).then((data) => {
          this.customerUserData = data;
            //console.log('User data: ', this.topUpUserData);
            this.tagUserId = this.customerUserData.userId;
            //console.log('User Id: ', this.topUpUserId);
            if(this.tagUserId) {
                this.customerUserId = this.tagUserId;
                this.WL.getWalletBalance(this.customerUserId,this.accessToken).subscribe((data)=> {
                  this.showWalletBalance = data;
                  this.walletBalance = Number(data);
                  this.walletBalanceSpinner = false;
                  //console.log('Current user wallet balance:',this.walletBalance);
                  this.CFS.presentToast('Scan Successful','bottom',1000);
                });
      
             } else {
              this.CFS.presentAlert('Error!','User ID not found!');
              this.walletBalanceSpinner = false;
             }
        });
     } else {
      this.CFS.presentAlert('Error!','No ID Found in your Tag/Card');
     }
    });
  }

  ngOnInit() {

  }

  buyAmount(data){
    this.formDisplay = false;
    this.tempAmount = this.tempAmount + Number(data);
    this.amount = this.tempAmount;
    //console.log('Buy Amount: ', this.amount);
  }

  clear(){
    this.amount = 0;
    this.formDisplay = false;
    setTimeout(() => {
      //console.log("I left checkout page 1 sec ago");
      window.location.reload();
    }, 300);
  }

  showForm(){
    this.amount = 0;
    this.formDisplay = true;
  }

  getCustomAmount(customAmount){
    this.amount = Number(customAmount.detail.value);
    //console.log('Custom Buy Amount: ', this.amount);
  }


buyItemNow(){
  
  this.totalAmount = Number(this.amount + this.totalAmount);
  if(this.amount <= 0 ) {
    this.CFS.presentAlert('Oops!','Select An Amount');
  } else if(!this.walletBalance){
    this.CFS.presentAlert('Oops!','Insufficient Funds!');
  } else if(!this.customerUserId){
    this.CFS.presentAlert('Oops!','Please scan your Tag/Card Via NFC to buy!');
  } else if(this.totalAmount > this.walletBalance) {
    this.CFS.presentAlert('Balance Shortage',`Your Current balance is KYD $${this.walletBalance}, Please top up first!`);
  } else {
    this.transactionValidated = true;
  }

  if(this.transactionValidated == true) {
    this.disableBtn = true;
    this.spinner = true;

    this.buyItemObj = {
      userId: this.customerUserId,
      type: 'debit',
      amount: this.amount,
      details: 'Debited By: ' + this.salesAgent + ', Amount KYD $' + this.amount + ', Customer ID : ' + this.customerUserId,
      token: this.accessToken,
    };
    //console.log('topUpDataObj: ', this.buyItemObj);
    
    this.WL.buyItem(this.buyItemObj).then((buyResp) => {
      //console.log('Buy Response: ',buyResp);
      this.topupStatus = buyResp;
        if(this.topupStatus.code == 200){
          this.CFS.presentToast('Payment is successful!','bottom', 2000);
          setTimeout(() => {
            //console.log("I left checkout page 1 sec ago");
            window.location.reload();
          }, 1500);
          
        } else {
          //enable submit button
          this.disableBtn = false;
          this.spinner = false;
          this.CFS.presentAlert('Oops!',`Payment Failed!`);
        }
    });
    
  } else {
    this.disableBtn = false;
    this.spinner = false;
  }
}



ionViewDidLeave() {
  //this.navCtrl.pop();
  setTimeout(() => {
    window.location.reload();
  },500);
  //console.log("Looks like I'm about to leave :(");
}

  reloadPWA(){
    window.location.reload();
  }

}
