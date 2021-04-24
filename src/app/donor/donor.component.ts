import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from '../common.service';
import { MatDialog } from '@angular/material/dialog'; 
import { DonorInformationDialogComponent } from '../donor-information-dialog/donor-information-dialog.component';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})


export class DonorComponent implements OnInit {

  
  donorForm: FormGroup;
  bloodGroups: any;
  cities: any;
  lat: any = '';
  lng: any = '';
  gotLocation: boolean = false;
  showProgressBar: boolean = false;
  message: string = '';
  messageColor: string = '';
  registeredNumbers: Array<number> = [];
  registeredNames: Array<string> = [];
  registeredCords: Array<Object> = [];
  alreadyRegistered: boolean = false;
  headers: Array<string> =  ['#','Name', 'Number', 'Details'];


  constructor(private formBuilder: FormBuilder, private datepipe: DatePipe, private commonService: CommonService, public dialog: MatDialog) {

    console.log(this.commonService.getCookie('mobile_nos'), 'value');
    this.setHistory();
    this.bloodGroups = [
      '(A+)', '(A-)', '(B+)', '(B-)', '(O+)', '(O-)','(AB+)', '(AB-)'  
    ];

    this.cities = [
      'Mumbai', 'Pune', 'Nashik', 'Delhi', 'Bangalore', 'Chennai', 'Kolkatta' , 'Other' 
    ];

    this.donorForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobile_no: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      recovery_date: [new Date(), Validators.required],
      city: ['', [Validators.required]],
      blood_group: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(10), Validators.max(99)]],
      pincode: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]],
    });

    this.donorForm.valueChanges.subscribe(form => {
      if (form.recovery_date) {
        this.donorForm.patchValue({
          recovery_date: this.datepipe.transform(form.recovery_date, 'yyyy-MM-dd')
        }, {
          emitEvent: false
        });
      }
    });
  }

  ngOnInit(): void {
  }

  setHistory(){
    if(this.commonService.getCookie('mobile_nos') && this.commonService.getCookie('names')){
      this.registeredNumbers = JSON.parse(this.commonService.getCookie('mobile_nos'));
      this.registeredNames = JSON.parse(this.commonService.getCookie('names'));
      this.registeredCords = JSON.parse(this.commonService.getCookie('cords'));
      this.alreadyRegistered = true;
    }
  }

  addDonor(){
    try{
      var name = this.donorForm.get('name')!.value;
      var mobile_no = this.donorForm.get('mobile_no')!.value;
      var recovery_date = this.donorForm.get('recovery_date')!.value;
      var city = this.donorForm.get('city')!.value;
      var blood_group = this.donorForm.get('blood_group')!.value;
      var age = this.donorForm.get('age')!.value;
      var pincode = this.donorForm.get('pincode')!.value;

      this.showProgressBar = true;

      this.commonService.addDonor(name, mobile_no, recovery_date, city, blood_group, age, pincode, this.lat, this.lng).subscribe(
      response=>{
        this.showProgressBar = false;
        console.log(response)
        this.message = response['message'];
        if(response.hasOwnProperty('success') && response['success']) {          
          this.messageColor = 'Green';
          this.donorForm.reset();
          for (let name in this.donorForm.controls) {
            this.donorForm.controls[name].setErrors(null);
          }

          var cords = { lat: this.lat, lng: this.lng };
          
          this.registeredNumbers.push(mobile_no);
          this.registeredNames.push(name);
          this.registeredCords.push(cords);
          
          this.commonService.setCookie('mobile_nos', JSON.stringify(this.registeredNumbers));
          this.commonService.setCookie('names', JSON.stringify(this.registeredNames));
          this.commonService.setCookie('cords', JSON.stringify(this.registeredCords));
          this.setHistory();
        }else{
          this.messageColor = 'Red';
        }
      }, error=>{
        this.showProgressBar = false;
        console.log(error);
      });
    }catch(e){
      this.messageColor = 'Red';
      this.message = 'Unable to submit you information';
      console.log(e);
    }
  }

  getLocation(){
    if(!navigator.geolocation){
      console.log('location is not supported');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.gotLocation = true;

      console.log(
        `lat: ${position.coords.latitude}, lon: ${position.coords.longitude}`
      );
    });
  }

  openDialog(mobile_no: number) {
    var param = {mobile_no: mobile_no, name: 'Donor'};
    this.dialog.open(DonorInformationDialogComponent, {
      width: '75%',
      data: param
    });
  }
}
