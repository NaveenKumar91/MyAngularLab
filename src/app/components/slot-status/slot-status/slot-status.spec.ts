import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotStatus } from './slot-status';

describe('SlotStatus', () => {
  let component: SlotStatus;
  let fixture: ComponentFixture<SlotStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
