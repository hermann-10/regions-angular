import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionsService } from './services/regions.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import Region from './interfaces/region';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    //this.regions$ = this.regionService.getRegions();//.subscribe();
    this.regionService
    .getRegions()
    .pipe(tap((data => this.regionsSig.set(data))))
    .subscribe();
  }

  title = 'regions';
  // regions$ = new Observable<Region[]>;
  regionsSig = signal<Region[]>([])
  regionService = inject(RegionsService);

}
