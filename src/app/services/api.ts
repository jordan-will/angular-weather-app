import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
// import { geolocation } from '../utils/geolocation';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators'
import { Geolocation } from './geolocation';
import { ENV } from '../env';

const API_KEY: string = ENV.API_KEY;
const BASE_URL: string = 'http://api.weatherapi.com/v1/'

export interface Weather {
  country: string,
  name: string,
  region: string,

  temp_c: number,
  windchill_c: number,//sensação térmica
  conditionText: string,//condition:text
  conditionIcon: string,//condition:icon
  wind_kph: number,//vento km/h
  precip_mm: number,//preciptação em ml	
  pressure_in: number,
  feelslike_c: number,//sensação termica
  humidity: number,//umidade
  isDay: number,//day = 1 night = 0
  uv: number,
  last_updated: string
}

@Injectable({
  providedIn: 'root',
})
export class Api {

  private http = inject(HttpClient)
  private geolocation = inject(Geolocation)

  getCurrentWather(locationName: string | null = null): Observable<Weather> {
    return this.geolocation.getLocation().pipe(
      switchMap((cord) => {
        // const query = locationName ? locationName : cord.lat ? `${cord.lat},${cord.long}` : 'Brasília';
        const query = locationName ? locationName : cord?.lat !== undefined && cord?.long !== undefined
          ? `${cord.lat},${cord.long}`
          : 'Brasília';

        return this.http.get(BASE_URL + 'current.json', {
          params: { key: API_KEY, q: query }
        });
      }),
      map((data: any) => {
        const dataFormatted: Weather = {
          country: data.location.country,
          name: data.location.name,
          region: data.location.region,
          temp_c: data.current.temp_c,
          windchill_c: data.current.windchill_c,
          feelslike_c: data.current.feelslike_c,
          conditionText: data.current.condition.text,
          conditionIcon: data.current.condition.icon,
          wind_kph: data.current.wind_kph,
          precip_mm: data.current.precip_mm,
          pressure_in: data.current.pressure_in,
          humidity: data.current.humidity,
          isDay: data.current.isDay,
          uv: data.current.uv,
          last_updated: data.current.last_updated
        };
        return dataFormatted;
      }),
      catchError((error) => {
        return throwError(() => new Error('Error on get weather'));
      })
    );
  }


}
