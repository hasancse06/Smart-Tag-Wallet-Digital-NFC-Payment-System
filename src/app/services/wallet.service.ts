import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';


declare var CryptoJSAesJson;

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  orderResp: any;
  walletBalance: any;
  history: any;
  agentHistory: any
  salesReport: any;
  apiUrl: string;
  siteURL = 'https://demo.hasan.online/github';
  walletExAPI= '/wp-json/woo-wallet-api/v1/';
  walletNative = '/wp-json/wp/v2/'

  secretkey = 'xeQmNTm2Gfa7cDVwMhy2ny';
  salt = localStorage.getItem('currentUserEmail');
  userId = localStorage.getItem('currentUserId');
  userRole = localStorage.getItem('userRole');
  encryptedKey: any;

  constructor(private http: HttpClient) { }

  encryptMe(data){
    this.encryptedKey = CryptoJSAesJson.encrypt(JSON.stringify(data), this.salt).toString();
    //console.log('Encrypted Key: ', this.encryptedKey);
    this.encryptedKey =  btoa(this.encryptedKey);
    //console.log('After base64 encode: ', this.encryptedKey);
    return this.encryptedKey;
  }

  // Common for all Wallet Login - User Role API 
  getUserDataForLogin(currentUserId, email) {
    let headers = new HttpHeaders ({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let loginEmail = email.toLowerCase();
    //console.log('currentUserId :',currentUserId);
    //console.log('email :',loginEmail);
    let encryptedKey = CryptoJSAesJson.encrypt(JSON.stringify(this.secretkey), loginEmail).toString();
    //console.log('After base64 encode: ', encryptedKey);
    let secretKey = btoa(encryptedKey);
    //console.log('secretKey: ', secretKey);

    let dataObj = {
      user_id: currentUserId,
      secret_key: secretKey
    };

    let finalDataObj = this.JSON_to_URLEncoded(dataObj);
    this.apiUrl = `${this.siteURL}${this.walletExAPI}user-role`;
    //console.log('getUserDataForLogin TC API URL: ', this.apiUrl);
    return new Promise((resolve) => {
      this.http.post(this.apiUrl, finalDataObj, {headers} ).subscribe((successResp) => {
        resolve(successResp);
      })
    });
  }

  // Wallet Main App Only - Get Tag User ID from Username
  getUserIdByUsername(username) {
    let headers = new HttpHeaders ({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let secretKey = this.encryptMe(this.secretkey);

    let dataObj = {
      user_name: username,
      user_id: this.userId,
      secret_key: secretKey
    };

    let finalDataObj = this.JSON_to_URLEncoded(dataObj);
    this.apiUrl = `${this.siteURL}${this.walletExAPI}user-name`;
    //console.log('getUserData TC API URL: ', this.apiUrl);
    return new Promise((resolve) => {
      this.http.post(this.apiUrl, finalDataObj, {headers} ).subscribe((successResp) => {
        resolve(successResp);
      })
    });
  }

  // Native to Tera Wallet
  getWalletBalance(userId,accessToken){
    let headers = new HttpHeaders ({
      'Authorization':  `Bearer ${accessToken}`
    });
    //console.log('header getWalletBalance: ',headers);
    this.apiUrl = `${this.siteURL}${this.walletNative}current_balance/${userId}`;
    //console.log('API URL for getWalletBalance: ',this.apiUrl);
    this.walletBalance = this.http.get(this.apiUrl,{headers});
    return this.walletBalance;
  }

  // Native to Tera wallet
  getTransactionHistory(userId,accessToken){
    let headers = new HttpHeaders ({
      'Authorization':  `Bearer ${accessToken}`
    });
    //console.log('header getTransactionHistory: ',headers);
    this.apiUrl = `${this.siteURL}${this.walletNative}wallet/${userId}`;
    //console.log('API URL for getTransactionHistory: ',this.apiUrl);
    this.history = this.http.get(this.apiUrl,{headers});
    return this.history;
  }

  // Debit/Charge the Wallet
  buyItem(dataObj){
    let headers = new HttpHeaders ({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    //console.log('headers for topUp: ',headers);
    let secretKey = this.encryptMe(this.secretkey);
    dataObj.agent_user_id = this.userId;
    dataObj.secret_key = secretKey;

    let orderDataObj = this.JSON_to_URLEncoded(dataObj);
    this.apiUrl = `${this.siteURL}${this.walletExAPI}wallet-debit`;
    //console.log('API URL for topUp: ',this.apiUrl);
    return new Promise((resolve) => {
      this.http.post(this.apiUrl ,orderDataObj,{headers}).subscribe((successResp) =>{
        resolve(successResp),
        (errorResp)=>{
          resolve(errorResp)
        }
      });
    });
  }

   // convert javascript object to x-www-form-urlencoded format
   JSON_to_URLEncoded(element, key?, list?) {
    var list = list || [];
    if (typeof element == "object") {
      for (var idx in element)
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + "[" + idx + "]" : idx,
          list
        );
    } else {
      list.push(key + "=" + encodeURIComponent(element));
    }
    return list.join("&");
  }
}
