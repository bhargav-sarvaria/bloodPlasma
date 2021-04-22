import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})


export class DonorComponent implements OnInit {

  
  donorForm: FormGroup;
  bloodGroups: any;
  lat: any = '';
  lng: any = '';
  gotLocation: boolean = false;


  constructor(private formBuilder: FormBuilder, private datepipe: DatePipe) {

    this.bloodGroups = [
      '(A+)', '(A-)', '(B+)', '(B-)', '(O+)', '(O-)','(AB+)', '(AB-)'  
    ]

    this.donorForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      mobile_no: ['', [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      recovery_date: ['', [Validators.required]],
      blood_group: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.min(100000), Validators.max(999999)]],
    })

    // this.donorForm = this.formBuilder.group({
    //   name: ['', []],
    //   mobile_no: ['', []],
    //   recovery_date: ['', []],
    //   blood_group: ['', []],
    //   dob: ['', []],
    //   pincode: ['', []],
    // })

    this.donorForm.valueChanges.subscribe(form => {
      if (form.recovery_date) {
        this.donorForm.patchValue({
          recovery_date: this.datepipe.transform(form.recovery_date, 'yyyy-MM-dd')
        }, {
          emitEvent: false
        });
      }
    });

    this.donorForm.valueChanges.subscribe(form => {
      if (form.dob) {
        this.donorForm.patchValue({
          dob: this.datepipe.transform(form.dob, 'yyyy-MM-dd')
        }, {
          emitEvent: false
        });
      }
    });
   }

  ngOnInit(): void {
  }

  submitDonation(){
    console.log(this.donorForm.value);
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

}
