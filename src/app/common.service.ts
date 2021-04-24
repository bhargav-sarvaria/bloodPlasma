import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface UserPostResponse {
  success: boolean,
  message: string,
  donor: Object,
  data: Array<RequestersInterface>
}

interface IObjectKeys {
  [key: string]: string | number;
}

interface RequestersInterface extends IObjectKeys {
  name: string;
  mobile_no: string;
  city: string;
  blood_group: string;
  gender: string;
  recovery_date: string;
  age: string;
  pincode: string;
  lat: number,
  lng: number,
  date: string
}

@Injectable({
  providedIn: 'root'
})


export class CommonService {

  
  keyStr = "ABCDBHARGAVLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  setCookie(key: any, value: any){
    this.cookieService.set(key, value, {expires: 365, sameSite: 'Lax'});
  }

  getCookie(key: any){
    return this.cookieService.get(key);
  }

  addDonor(name: string, mobile_no: string, recovery_date: string, city: string, blood_group: string, age: string, pincode: string, lat: string, lng: string): Observable<UserPostResponse>{

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type','application/json');

    const params = { 
      name: name,
      mobile_no: mobile_no,
      recovery_date: recovery_date,
      city: city,
      blood_group: blood_group,
      age: age,
      pincode: pincode,
      lat: lat,
      lng: lng
    };
    // console.log(params);

    return  this.httpClient.post<UserPostResponse>('api/addDonor', params, {headers: httpHeaders});
  }

  addRequest(name: string, mobile_no: string, city: string, blood_group: string, gender: string, age: string, pincode: string, lat: string, lng: string): Observable<UserPostResponse>{

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type','application/json');

    const params = { 
      name: name,
      mobile_no: mobile_no,
      gender: gender,
      city: city,
      blood_group: blood_group,
      age: age,
      pincode: pincode,
      lat: lat,
      lng: lng,
      date: this.getDate()
    };
    // console.log(params);

    return  this.httpClient.post<UserPostResponse>('api/addRequest', params, {headers: httpHeaders});
  }

  getDonor(mobile_no: number): Observable<UserPostResponse>{

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type','application/json');

    const params = { mobile_no: mobile_no };
    return  this.httpClient.post<UserPostResponse>('api/getDonor', params, {headers: httpHeaders});
  }

  getRequest(mobile_no: number): Observable<UserPostResponse>{

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type','application/json');

    const params = { mobile_no: mobile_no };
    return  this.httpClient.post<UserPostResponse>('api/getRequest', params, {headers: httpHeaders});
  }

  getRequests(mobile_no: number): Observable<UserPostResponse>{

    const httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type','application/json');

    const params = { mobile_no: mobile_no };
    return  this.httpClient.post<UserPostResponse>('api/getRequests', params, {headers: httpHeaders});
  }

  getDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    var datestr = dd + '/' + mm + '/' + yyyy;
    return datestr;
  }
}
