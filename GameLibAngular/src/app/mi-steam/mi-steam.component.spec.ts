import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiSteamComponent } from './mi-steam.component';

describe('MiSteamComponent', () => {
  let component: MiSteamComponent;
  let fixture: ComponentFixture<MiSteamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiSteamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiSteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
