import { Component, OnInit } from '@angular/core';

interface IObjectKeys {
  [key: string]: string | number;
}

interface BankInterface extends IObjectKeys {
  name: string;
  number: string;
  location: string;
}

@Component({
  selector: 'app-donor-banks',
  templateUrl: './donor-banks.component.html',
  styleUrls: ['./donor-banks.component.scss']
})

export class DonorBanksComponent implements OnInit {

  headers: Array<String> = ['#', 'Location', 'Name', 'Tell No.'];

  banks: Array<BankInterface> = [
    {location: 'Bandra', name: 'Mahatma Gandhi Seva Mandir Blood Centre', number: '98926 81771'},
    {location: 'Jogeshwari', name: 'Manas Serological Institue Blood Centre', number: '022-2678 4546'},
    {location: 'Nalasopara', name: 'Sathiya Trust Blood Centre', number: '98223 55884'},
    {location: 'Byculla', name: 'JJ Mahanagar Blood Centre', number: '022-2373 5585'},
    {location: 'Sion', name: 'Sion Blood Centre', number: '95946 42222'},
    {location: 'Ghatkopar', name: 'Samarpan Blood Centre', number: '022-2511 1313'},
    {location: 'Mulund', name: 'Arpan Blood Centre', number: '70302 00050'},
    {location: 'Thane', name: 'Lokmanya TSSIA Blood Centre', number: '022-2580 3246'},
    {location: 'Koparkhairne', name: 'Sadguru Blood Centre', number: '022-2755 6000'},
    {location: 'Thane', name: 'Blood Line Charitable Blood Centre', number: '022-25375000'},
    {location: 'Dombivali', name: 'Plasma Diagnostics Blood Centre', number: '0251-2431932/ 9769851008'},
    {location: 'Kalyan', name: 'Sankalp Blood Centre', number: '0251-2300096'},
    {location: 'Bhiwandi', name: 'Bhiwandi Blood Centre', number: '98232 71858'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
