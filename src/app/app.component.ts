import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionsService } from './services/regions.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, tap } from 'rxjs';
import Region from './interfaces/region';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
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
  regionsSig = signal<Region[]>([])
  regions: Region[] = [] ;
  regionService = inject(RegionsService);
  selectedRegionSig = this.regionService.selectedRegionSig;
  subscription!: Subscription;
  regionDepartmentsSig = this.regionService.regionDepartmentsSig;
  filterBySig = signal<string>('');

  filterEffect = effect(() => {
    console.log(this.filterBySig().toLocaleLowerCase());
    // if(this.filterBySig() === ''){
    //   this.resetRegions();
    //   return;
    // }

    this.regions = this.regionsSig().filter((reg) =>
    reg.Name.toLocaleLowerCase().startsWith(
      this.filterBySig().toLocaleLowerCase()
    )
    );
    console.log({ filteredRegions: this.regions });
  });

  // resetRegions(){
  //   this.regions = this.regionsSig();
  // }

  selectRegion(region: Region){
    this.selectedRegionSig.set(region);
  }
}
