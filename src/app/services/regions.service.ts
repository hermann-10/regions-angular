import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import Region, { RegionDTO } from './../interfaces/region';
import Department from '../interfaces/departments';
;
@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  private REGIONS_URL = 'https://geo.api.gouv.fr/regions?fields=nom,code';

  // full departement url should be https://geo.api.gouv.fr/regions/53/departements
  private DEPARTMENTS_URL = 'https://geo.api.gouv.fr/regions';
  regionDepartmentsSig = signal<Department[]>([])

  selectedRegionSig = signal<Region>({ Code: '-1', Name: ''});
  private departementsEffect = effect(()=> {
    console.log(this.selectedRegionSig());
    if (this.selectedRegionSig().Code === '-1'){
      return;
    }
    this.http.get<Department[]>(`${this.DEPARTMENTS_URL}/${this.selectedRegionSig().Code}/departements`).pipe(tap(data => console.log({ departments: data })))
    .subscribe(departments => this.regionDepartmentsSig.set(departments))
  })
  http = inject(HttpClient)

  getRegions(): Observable<Region[]>{
    return this.http
    .get<RegionDTO[]>(this.REGIONS_URL)
    .pipe(
      tap((data) => console.log(data)),
      map((data: RegionDTO[]) => this.changeFields(data)),
      tap(data => console.log(data))
    );
  }

  changeFields(data: RegionDTO[]): Region[]{
    const regions: Region[] = [];
    for (let index = 0; index < data.length; index++) {
      const reg: Region = {
        Name: data[index].nom,
        Code: data[index].code
      }
      regions.push(reg)
    }
    return regions;
  }
}
