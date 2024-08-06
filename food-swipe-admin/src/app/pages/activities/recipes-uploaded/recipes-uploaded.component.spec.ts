import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesUploadedComponent } from './recipes-uploaded.component';

describe('RecipesUploadedComponent', () => {
  let component: RecipesUploadedComponent;
  let fixture: ComponentFixture<RecipesUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipesUploadedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
