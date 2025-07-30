import { TestBed } from '@angular/core/testing';
import { Geolocation } from './geolocation';
import { of, throwError } from 'rxjs'
import { provideZonelessChangeDetection } from '@angular/core';

describe('Geolocation', () => {

  let service: Geolocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Geolocation,
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(Geolocation);
  });

  it('should return latitude and longitude', (done) => {
    spyOn(service, 'getLocation').and.returnValue(
      of({ lat: 10, long: 10})
    )
    service.getLocation().subscribe((coords) => {
      expect(coords).toEqual({ lat: 10, long: 10 })
      done()
    })
  })

  it('should handle error gracefully', () => {
    spyOn(service, 'getLocation').and.returnValue(
      throwError(()=> new Error('Geolocation not supported'))
    )
    service.getLocation()
    .subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error).toBeInstanceOf(Error),
        expect(error.message).toBe('Geolocation not supported')
      }
    })
  })

});
