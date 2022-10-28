import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTaskDetailComponent } from './board-task-detail.component';

describe('BoardTaskDetailComponent', () => {
  let component: BoardTaskDetailComponent;
  let fixture: ComponentFixture<BoardTaskDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardTaskDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
