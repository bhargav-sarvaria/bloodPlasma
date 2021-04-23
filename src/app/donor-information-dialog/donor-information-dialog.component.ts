import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../common.service';

interface IObjectKeys {
  [key: string]: string | number;
}

interface IDevice extends IObjectKeys {
  name: string;
  mobile_no: string;
  blood_group: string;
  gender: string;
  recovery_date: string;
  age: string;
  pincode: string;
}

interface DialogParam extends IObjectKeys {
  name: string;
  mobile_no: number;
}

@Component({
  selector: 'app-donor-information-dialog',
  templateUrl: './donor-information-dialog.component.html',
  styleUrls: ['./donor-information-dialog.component.scss']
})
export class DonorInformationDialogComponent implements OnInit {

  donor: any = {};
  headers: Array<string> = ['name', 'mobile_no', 'blood_group', 'gender', 'recovery_date', 'age', 'pincode'];
  headers_reformed: IDevice = { 'name':'Name', 'mobile_no': 'Mobile No.', 'blood_group': 'Blood Group',
   'recovery_date': 'Date of Recovery', 'age': 'Age', 'pincode': 'Pin Code', 'gender' : 'Gender'
  }
  mobile_no: number;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) private dialogData: DialogParam,
    private matDialogRef: MatDialogRef<DonorInformationDialogComponent>,
    private commonService: CommonService
  ) { 
    console.log(dialogData);
    this.mobile_no = dialogData.mobile_no;
    this.type = dialogData.name;
  }

  ngOnInit(): void {

    if(this.type == 'Donor'){
      this.commonService.getDonor(this.mobile_no).subscribe(response=>{
        if(response.hasOwnProperty('success') && response['success']) {
          this.donor = response['donor'];
          console.log(this.donor);
        } 
      }, error=>{
        console.log(error);
      });
    }else if(this.type == 'Requester'){
      this.commonService.getRequest(this.mobile_no).subscribe(response=>{
        if(response.hasOwnProperty('success') && response['success']) {
          this.donor = response['donor'];
          console.log(this.donor);
        } 
      }, error=>{
        console.log(error);
      });
    }

    

  }

}
