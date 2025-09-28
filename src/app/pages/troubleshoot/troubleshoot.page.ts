import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { CommonfunctionService } from 'src/app/services/commonfunction.service';

@Component({
  selector: 'app-troubleshoot',
  templateUrl: './troubleshoot.page.html',
  styleUrls: ['./troubleshoot.page.scss'],
})
export class TroubleshootPage implements OnInit {

  isInternetActive: boolean = true;
  networkName: any;
  isNFCActive: boolean = true;

  tagid: any;
  tagUserId: any;
  tagUserName: any;
  
  constructor(
    private network: Network,
    private nfc: NFC,
    private CFS: CommonfunctionService

  ) {

   }

  ngOnInit() {

  }

  ionViewWillEnter(){
    this.getNFCStatus();
    this.getNewtworkStatus();
    this.nfcScanTest();
  }

  getNewtworkStatus(){
    this.networkName = this.network.type;
    //console.log('Network Type: ',this.networkName);
    if( this.networkName === 'none' || this.networkName === 'unknown' ) {
      // if offline
      this.isInternetActive = false;
    } else {
      this.isInternetActive = true;
    }
  }

  getNFCStatus(){
    this.nfc.enabled().then(

      success => {
        console.log('getNFCStatus: ',success);
        this.isNFCActive = true;
      },

      error => {
        console.log('getNFCStatus: ',error);
        this.isNFCActive = false;
      }
    );
  }


nfcScanTest(){
    this.nfc.addNdefListener(() => {
      this.CFS.presentToast('NFC Initialised','bottom',1000);
      //console.log('successfully attached ndef listener');
    }, async (err) => {
      //console.log('error attaching ndef listener', err);
  
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
     } else {
      this.CFS.presentAlert('Error!','No ID Found in your Tag/Card');
     }
    });
}


  showNFCSetting(){
    this.nfc.showSettings();
    //console.log('showSettings');
  }

  reloadPWA(){
    window.location.reload();
  }

}
