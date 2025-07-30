import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Geolocation {
  
  getLocation(): Observable<{ lat: number; long: number }> {
    return new Observable(observer => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              lat: position.coords.latitude,
              long: position.coords.longitude,
            });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error(new Error('Geolocation not supported'));
      }
    });
  }
  
}
