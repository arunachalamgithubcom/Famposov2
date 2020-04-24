import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinfreeComponent } from './joinfree.component';

describe('JoinfreeComponent', () => {
  let component: JoinfreeComponent;
  let fixture: ComponentFixture<JoinfreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinfreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinfreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
