import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from '../common.service';
import { MatDialog } from '@angular/material/dialog'; 
import { DonorInformationDialogComponent } from '../donor-information-dialog/donor-information-dialog.component';

@Component({
  selector: 'app-requester',
  templateUrl: './requester.component.html',
  styleUrls: ['./requester.component.scss']
})
export class RequesterComponent implements OnInit {

  requesterForm: FormGroup;
  cities: any;
  bloodGroups: any;
  genders: any;
  lat: any = '';
  lng: any = '';
  gotLocation: boolean = false;
  showProgressBar: boolean = false;
  message: string = '';
  messageColor: string = '';
  registeredNumbers: Array<number> = [];
  registeredNames: Array<string> = [];
  alreadyRegistered: boolean = false;
  headers: Array<string> =  ['#','Name', 'Number', 'Details'];

  constructor(private formBuilder: FormBuilder, private datepipe: DatePipe, private commonService: CommonService, public dialog: MatDialog) {

    this.setHistory();
    this.bloodGroups = [
      '(A+)', '(A-)', '(B+)', '(B-)', '(O+)', '(O-)','(AB+)', '(AB-)'  
    ];
    this.genders = [
      'Female', 'Male'  
    ];
    this.cities = [
      'Mumbai', 'Pune', 'Nashik', 'Delhi', 'Bangalore', 'Chennai', 'Kolkatta'  , 'Other'
    ];

    this.requesterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobile_no: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      city: ['', [Validators.required]],
      blood_group: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(10), Validators.max(99)]],
      pincode: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]],
    });
  }

  setHistory(){
    if(this.commonService.getCookie('requester_mobile_nos') && this.commonService.getCookie('requester_names')){
      this.registeredNumbers = JSON.parse(this.commonService.getCookie('requester_mobile_nos'));
      this.registeredNames = JSON.parse(this.commonService.getCookie('requester_names'));
      this.alreadyRegistered = true;
    }
  }

  ngOnInit(): void {
  }

  addRequest(){
    try{
      var name = this.requesterForm.get('name')!.value;
      var mobile_no = this.requesterForm.get('mobile_no')!.value;
      var city = this.requesterForm.get('city')!.value;
      var blood_group = this.requesterForm.get('blood_group')!.value;
      var gender = this.requesterForm.get('gender')!.value;
      var age = this.requesterForm.get('age')!.value;
      var pincode = this.requesterForm.get('pincode')!.value;

      this.showProgressBar = true;

      this.commonService.addRequest(name, mobile_no, city, blood_group, gender, age, pincode, this.lat, this.lng).subscribe(
      response=>{
        this.showProgressBar = false;
        console.log(response)
        this.message = response['message'];
        if(response.hasOwnProperty('success') && response['success']) {          
          this.messageColor = 'Green';
          this.requesterForm.reset();
          for (let name in this.requesterForm.controls) {
            this.requesterForm.controls[name].setErrors(null);
          }

          this.registeredNumbers.push(mobile_no);
          this.registeredNames.push(name);
          this.commonService.setCookie('requester_mobile_nos', JSON.stringify(this.registeredNumbers));
          this.commonService.setCookie('requester_names', JSON.stringify(this.registeredNames));
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
    var param = {mobile_no: mobile_no, name: 'Requester'};
    let  dialogRef = this.dialog.open(DonorInformationDialogComponent, {
      width: '75%',
      data: param
    });
  }
}
