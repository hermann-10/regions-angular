import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegionsService } from './services/regions.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import Region from './interfaces/region';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Department from './interfaces/departments';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
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

    this.departmentSubscription = this.textControl.valueChanges
      .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      //filter(values => values.length > 2),
      tap((data) => this.departmentFilterSig.set(data)),
      )
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
  departmentSubscription!: Subscription;

  departmentFilterSig = signal<string>('');
  departmentFiltered: Department[] = [];
  departmentEffect = effect(() => {
    this.departmentFiltered = this.regionService
    .regionDepartmentsSig()
    .filter((dep: Department) => {
      return dep.nom
      .toLocaleLowerCase()
      .startsWith(this.departmentFilterSig()
      .toLocaleLowerCase())
    });
  });

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

  textControl = new FormControl();
  // resetRegions(){
  //   this.regions = this.regionsSig();
  // }

  selectRegion(region: Region){
    this.selectedRegionSig.set(region);
  }
}
