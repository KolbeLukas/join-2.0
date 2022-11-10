import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpInstructionsComponent } from './help-instructions.component';

describe('HelpInstructionsComponent', () => {
  let component: HelpInstructionsComponent;
  let fixture: ComponentFixture<HelpInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpInstructionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
