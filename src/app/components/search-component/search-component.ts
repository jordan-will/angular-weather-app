import { CommonModule, JsonPipe } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="search">
      <form class="search__form" #searchForm="ngForm" (ngSubmit)="onSubmit(); searchForm.resetForm()">
        <input class="search__input" type="text" name="search" #searchInput=ngModel [(ngModel)]="search" placeholder="Search by location name" required/>
        <button 
          class="search__btn" 
          type="submit" 
          [disabled]="!searchForm.form.valid"
          >Serch</button>
          <div class="search__warning" *ngIf="searchInput.invalid && searchInput.touched">
            Enter the location name
        </div>
      </form>
    </div>
  `,
  styleUrl: './search-component.scss',
  standalone: true
})
export class SearchComponent {
  
  search:string = ''
  submitted:boolean = false
  locationName = output<string>()

  onSubmit(){
    if(!this.search) return
    console.log('LOCATION NAME', this.search)
    this.submitted = true
    this.locationName.emit(this.search)
  }
}
