import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Weather, Api } from './services/api';
import { of, throwError } from 'rxjs';

describe('App', () => {

  let component: App
  let fixture: ComponentFixture<App>
  let element: HTMLElement

  const mockWeather: Weather = {
    country: 'Brasil',
    name: 'Brasília',
    region: 'Distrito Federal',
    temp_c: 25,
    windchill_c: 24,
    conditionText: 'Ensolarado',
    conditionIcon: 'http://example.com/icon.png',
    wind_kph: 10,
    precip_mm: 0,
    humidity: 60,
    isDay: 1,
    uv: 5,
    last_updated: '2024-07-29',
    feelslike_c: 27,
    pressure_in: 1013
  };

  const apiMock = jasmine.createSpyObj<Api>('Api', ['getCurrentWather'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App
      ],
      providers: [
        {
          provide: Api,
          useValue: apiMock
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents();

    apiMock.getCurrentWather.and.returnValue(
      of(null as any)
    )
    fixture = TestBed.createComponent(App)
    component = fixture.componentInstance
    element = fixture.nativeElement
    // fixture.detectChanges()

  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "Angular Weather"', () => {
    expect(component.title).toBe('Angular Weather')
  })

  it('should call getCurrentWeather and set the weather signal on init', () =>{
    apiMock.getCurrentWather.and.returnValue(
      of(mockWeather)
    )
    component.ngOnInit()
    expect(apiMock.getCurrentWather).toHaveBeenCalled()
    expect(component.weather()).toEqual(mockWeather)
  })

  it('should display country and region in title', () => {
    apiMock.getCurrentWather.and.returnValue(of(mockWeather))
    fixture.detectChanges()
    const title = element.querySelector('.weather__title') as HTMLElement
    expect(title.textContent).toContain('Brasil, Distrito Federal')
  })

  it('should display weather condition icon', () => {
    apiMock.getCurrentWather.and.returnValue(of(mockWeather))
    fixture.detectChanges()
    const icon = element.querySelector('.weather__info-temp img') as HTMLImageElement
    expect(icon.src).toBe(mockWeather.conditionIcon)
  })

  it('should display the current temperature', () => {
    apiMock.getCurrentWather.and.returnValue(
      of(mockWeather)
    )
    fixture.detectChanges()
    const temp = element.querySelector('.weather__info-temp') as HTMLElement
    expect(temp.textContent).toContain('25 °C')
  })

  it('should render all weather detail items', () => {
    apiMock.getCurrentWather.and.returnValue(of(mockWeather))
    fixture.detectChanges()
    const items = element.querySelectorAll('.weather__item')
    expect(items.length).toBe(8)
  })

  it('should handle API error and render weather info', () => {
    const consoleSpy = spyOn(console, 'error')
    
    apiMock.getCurrentWather.and.returnValue(
      throwError(() => new Error('Error on get weather'))
    )
    fixture.detectChanges()
    
    const main = element.querySelector('.weather__main')
    expect(main).toBeNull()//UI not be render

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error on set weather',
      jasmine.any(Error)
    )

    expect(component.error()).toBe('Error on get weather data')

  })

});
