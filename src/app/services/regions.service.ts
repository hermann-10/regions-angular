import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import Region, { RegionDTO } from './../interfaces/region';
;
@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  private REGIONS_URL ='https://geo.api.gouv.fr/regions?fields=nom,code';
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
