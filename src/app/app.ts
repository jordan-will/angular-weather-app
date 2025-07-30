import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Api, Weather } from './services/api';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './components/search-component/search-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit {
  
  title = 'Angular Weather';
  weatherApi = inject(Api)
  weather = signal<Weather|null>(null)
  error = signal<string|null>(null)

  ngOnInit(): void {
    this.getWeather()
  }

  getWeather(location:string|null = null){
    console.log('loc ', location)
    this.weatherApi.getCurrentWather(location)
      .subscribe({
        next: (data) => {
          this.weather.set(data as Weather)
          this.error.set(null)
        },
        error: (err) => {
          console.error('Error on set weather', err)
          this.weather.set(null)
          this.error.set('Error on get weather data')
        }
      })
  }

}
