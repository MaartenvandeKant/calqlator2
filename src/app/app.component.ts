import { Component } from '@angular/core';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { Options } from 'ng5-slider';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'iot';
  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };
}
