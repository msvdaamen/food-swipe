import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBooksComponent } from './recipe-books.component';

describe('RecipeBooksComponent', () => {
  let component: RecipeBooksComponent;
  let fixture: ComponentFixture<RecipeBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
