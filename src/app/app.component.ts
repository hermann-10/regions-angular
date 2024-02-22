import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionsService } from './services/regions.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, tap } from 'rxjs';
import Region from './interfaces/region';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    //this.regions$ = this.regionService.getRegions();//.subscribe();
    this.subscription = this.regionService
    .getRegions()
    .pipe(tap((data => this.regionsSig.set(data))))
    .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  title = 'regions';
  // regions$ = new Observable<Region[]>;
  regionsSig = signal<Region[]>([])
  regionService = inject(RegionsService);
  selectedRegionSig = this.regionService.selectedRegionSig;
  subscription!: Subscription;
  regionDepartmentsSig = this.regionService.regionDepartmentsSig

  selectRegion(region: Region){
    this.selectedRegionSig.set(region);
  }
}
