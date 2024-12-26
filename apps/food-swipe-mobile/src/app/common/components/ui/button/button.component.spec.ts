import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;

  beforeEach(async () => {
    component = new ButtonComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to change color', () => {
    component.color = 'secondary';
    expect(component.color).toBe('secondary');
  });
});
