import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from "@ionic/angular";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonfunctionService {

  private userDisplayName = new Subject<any>();

  constructor(
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController,
    private storage: Storage
    ) { }

  async presentToast(messageToShow,mesgPosition,showDuration){
    const toast = await this.toastCtrl.create({
      message: messageToShow,
      position: mesgPosition,
      duration: showDuration
    });
    toast.present();
  }

presentAlert(alrtHeader,alrtMessage) {
  let alert = this.alertCtrl.create({
    header: alrtHeader,
    subHeader: alrtMessage,
    buttons: ['Dismiss']
  }).then ((alert) =>{
   alert.present();
  });
 
}

validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

setDisplayName(displayName: string) {
  this.userDisplayName.next({ display_name: displayName });
}

getDisplayName(): Observable<any> {
  return this.userDisplayName.asObservable();
}

}
