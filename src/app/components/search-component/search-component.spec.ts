import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SearchComponent } from './search-component';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideZonelessChangeDetection()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty search value', () => {
    expect(component.search).toBe('')
  })

  it('should disabled submit button if input is inavlid', async () => {
    await fixture.whenStable()
    fixture.detectChanges()

    const button = fixture.debugElement.query(
      By.css('button')
    ).nativeElement
    expect(button.disabled).toBeTrue()
  })

  it('should enable submit button when input is valid', async () => {
    
    const input = fixture.debugElement.query(
      By.css('input')
    ).nativeElement
    input.value = 'Moscow'
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    /**
     * await angular to finish
     * all pedents events on view
     */
    await fixture.whenStable()
    fixture.detectChanges()

    const button = fixture.debugElement.query(
      By.css('button')
    ).nativeElement


    expect(button.disabled).toBeFalse()

  })

  it('should emit locationName when from is submitted', async () => {
    spyOn(component.locationName, 'emit')
    const input = fixture.debugElement.query(
      By.css('input')
    ).nativeElement

    input.value = 'Berlin'
    input.dispatchEvent(new Event('input'))
    
    await fixture.whenStable()
    fixture.detectChanges()

    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('ngSubmit')
    fixture.detectChanges()

    expect(component.locationName.emit).toHaveBeenCalledOnceWith('Berlin')
    expect(component.submitted).toBeTrue()
  })

  it('should not emit if search is empty', () => {
    spyOn(component.locationName, 'emit')
    component.search = ''
    fixture.detectChanges()

    fixture.whenStable()
    const form = fixture.debugElement.query(By.css('form'))
    form.triggerEventHandler('ngSubmit')
    fixture.detectChanges()

    expect(component.locationName.emit).not.toHaveBeenCalled()

  })

});
