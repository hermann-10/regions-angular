import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionsService } from './services/regions.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import Region from './interfaces/region';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  regions$ = new Observable<Region[]>;


  ngOnInit(): void {
    this.regions$ = this.regionService.getRegions();//.subscribe();
  }

  title = 'regions';


  regionService = inject(RegionsService);

}
