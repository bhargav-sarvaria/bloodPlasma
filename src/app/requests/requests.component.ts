import { Component, OnInit } from '@angular/core';
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
import { CommonService } from '../common.service';

interface IObjectKeys {
  [key: string]: string | number | Object;
}

interface Cordinates extends IObjectKeys {
  lat: number,
  lng: number
}

interface DonorInterface extends IObjectKeys {
  name: string;
  mobile_no: string;
  cords: Cordinates;
}

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})

export class RequestsComponent implements OnInit {

  donors: Array<DonorInterface> = [];
  requesters: any = [];
  headers: Array<String> = ['Name', 'Age', 'Mobile', 'Distance'];

  constructor(private mapsAPILoader: MapsAPILoader, private commonService: CommonService) {

    if(this.commonService.getCookie('mobile_nos') && this.commonService.getCookie('names')){
      var numbers = JSON.parse(this.commonService.getCookie('mobile_nos'));
      var names = JSON.parse(this.commonService.getCookie('names'));
      var cords = JSON.parse(this.commonService.getCookie('cords'));
      console.log('cords', cords);

      for(let i=0; i<numbers.length; i++){
        var obj: DonorInterface  = { name: names[i], mobile_no: numbers[i], cords: cords[i]};
        this.donors.push(obj);
      }
    }

  }

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      if(this.donors.length>0){
        var donorObj: DonorInterface  = this.donors[0];
        this.commonService.getRequests( parseInt(donorObj.mobile_no)).subscribe( response=>{
          var requesters = response['data'];
          for(let i=0; i<requesters.length; i++){
            requesters[i].distance = this.calculateDistance(donorObj.cords.lat, donorObj.cords.lng, requesters[i].lat, requesters[i].lng);
          }
          var requesters = requesters.sort((a, b) => (a.distance < b.distance ? -1 : 1));
          console.log(requesters);
          this.requesters = requesters;

        }, error=>{
          console.log(error);
        });
      }
    });
  }

  calculateDistance(lt1: number, lg1: number, lt2: number, lg2: number): number {
    const mexicoCity = new google.maps.LatLng(lt1, lg1);
    const jacksonville = new google.maps.LatLng(lt2, lg2);

    const distanceInKm = Math.round(google.maps.geometry.spherical.computeDistanceBetween(mexicoCity, jacksonville) / 1000);
    return distanceInKm;
  }

}
