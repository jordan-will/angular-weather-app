import { TestBed } from '@angular/core/testing';
import { Api, Weather } from './api';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { from, of } from 'rxjs';
import { Geolocation } from './geolocation';

describe('Api', () => {

  let service: Api;
  let geolocation: Geolocation
  let httpTesting: HttpTestingController

  const mockResponse = {
    location: {
      country: 'Brasil',
      name: 'Brasília',
      region: 'Distrito Federal'
    },
    current: {
      temp_c: 25,
      windchill_c: 24,
      condition: {
        text: 'Ensolarado',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png'
      },
      wind_kph: 10,
      precip_mm: 0.0,
      humidity: 60,
      isDay: 1,
      uv: 5,
      pressure_in: 10,
      last_updated: 'GMT-0900',
      feelslike_c: 35
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Api,
        Geolocation,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    });
    service = TestBed.inject(Api);
    geolocation = TestBed.inject(Geolocation)
    httpTesting = TestBed.inject(HttpTestingController)
  });

  afterEach(() => {
    httpTesting.verify()
  })

  it('should return formated data from weather', () => {

    spyOn(geolocation, 'getLocation')
      .and.returnValue(
        of({ lat: -15.8, long: -47.9 })
      )

    const expectedWeather = {
      country: 'Brasil',
      name: 'Brasília',
      region: 'Distrito Federal',
      temp_c: 25,
      windchill_c: 24,
      conditionText: 'Ensolarado',
      conditionIcon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      wind_kph: 10,
      precip_mm: 0.0,
      humidity: 60,
      isDay: 1,
      uv: 5,
      last_updated: 'GMT-0900',
      feelslike_c: 35,
      pressure_in: 10
    };

    service.getCurrentWather()
      .subscribe((data) => {
        expect(data).toEqual(expectedWeather)
      })


    const req = httpTesting.expectOne(req => {
      console.log('REQ PARAMS: ', req.params.get('q'));
      return (
        req.method === 'GET' &&
        req.url === 'http://api.weatherapi.com/v1/current.json' &&
        req.params.get('key') === 'e296645e55184c3da6f132454252807' &&
        req.params.get('q') === '-15.8,-47.9'
      );
    });


    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  it('should catch error on API and receive his message', () => {

    spyOn(geolocation, 'getLocation').and.returnValue(
      of({ lat: 0, long: 0 })
    )

    const errorMock = {
      status: 500,
      statusText: 'Error on get weather'
    }

    service.getCurrentWather().subscribe({
      next: () => fail('Should throw the error'),
      error: (error) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Error on get weather')
      }
    })

    const req = httpTesting.expectOne('http://api.weatherapi.com/v1/current.json?key=e296645e55184c3da6f132454252807&q=0,0')
    req.flush(null, errorMock)

  })

});
