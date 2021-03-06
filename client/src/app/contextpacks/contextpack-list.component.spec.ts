import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockContextPackService } from '../../testing/contextpack.service.mock';
import { ContextPack } from './contextpack';
import { ContextPackCardComponent } from './contextpack-card.component';
import { ContextPackListComponent } from './contextpack-list.component';
import { ContextPackService } from './contextpack.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';

const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('ContextPack list', () => {

  let contextpackList: ContextPackListComponent;
  let fixture: ComponentFixture<ContextPackListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextPackListComponent, ContextPackCardComponent],

      providers: [{ provide: ContextPackService, useValue: new MockContextPackService() },
                  {provide: MatSnackBar},
                  {provide: Overlay}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextPackListComponent);
      contextpackList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the ContextPacks', () => {
    expect(contextpackList.serverFilteredContextpacks.length).toBe(3);
  });

  it('contains a ContextPack named \'fun\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'fun')).toBe(true);
  });

  it('contain a ContextPack named \'happy\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'happy')).toBe(true);
  });
  it('contain a ContextPack named \'sun\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'sun')).toBe(true);
  });
  it('doesn\'t contain a contextpack named \'Santa\'', () => {
    expect(contextpackList.serverFilteredContextpacks.some((contextpack: ContextPack) => contextpack.name === 'Santa')).toBe(false);
  });
});

describe('Misbehaving ContextPack List', () => {
  let contextpackList: ContextPackListComponent;
  let fixture: ComponentFixture<ContextPackListComponent>;

  let getContextPacksSub: {
    getContextPacks: () => Observable<ContextPack[]>;
    getContextPacksFiltered: () => Observable<ContextPack[]>;
  };

  beforeEach(() => {
    // stub ContextPackService for test purposes
    getContextPacksSub = {
      getContextPacks: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getContextPacksFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ContextPackListComponent],
      // providers:    [ ContextPackService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: ContextPackService, useValue: getContextPacksSub }]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ContextPackListComponent);
      contextpackList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a WordlistListService', () => {
    // Since the observer throws an error, we don't expect contextpacks to be defined.
    expect(contextpackList.serverFilteredContextpacks).toBeUndefined();
  });

});
