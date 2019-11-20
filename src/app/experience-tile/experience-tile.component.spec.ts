import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceTileComponent } from './experience-tile.component';

describe('ExperienceTileComponent', () => {
  let component: ExperienceTileComponent;
  let fixture: ComponentFixture<ExperienceTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
