import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TroubleshootPage } from './troubleshoot.page';

describe('TroubleshootPage', () => {
  let component: TroubleshootPage;
  let fixture: ComponentFixture<TroubleshootPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TroubleshootPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TroubleshootPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
