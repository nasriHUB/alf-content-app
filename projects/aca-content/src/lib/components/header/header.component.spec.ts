/*!
 * @license
 * Alfresco Example Content Application
 *
 * Copyright (C) 2005 - 2020 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { AppHeaderComponent } from './header.component';
import { AppState } from '@alfresco/aca-shared/store';
import { of } from 'rxjs';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, SharedToolbarModule } from '@alfresco/aca-shared';
import { CoreModule, SidenavLayoutComponent } from '@alfresco/adf-core';
import { AppSearchInputModule } from '../search/search-input.module';
import { By } from '@angular/platform-browser';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  const actions = [
    { id: 'action-1', type: 'button' },
    { id: 'action-2', type: 'button' }
  ] as Array<ContentActionRef>;

  const store = {
    select: jasmine.createSpy('select'),
    dispatch: () => {}
  } as any;

  const appExtensionService = {
    getHeaderActions: () => of(actions)
  } as any;

  const app = {
    headerColor: 'some-color',
    headerTextColor: 'text-color',
    appName: 'name',
    logoPath: 'some/path'
  } as AppState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, CoreModule.forChild(), AppSearchInputModule, SharedToolbarModule],
      declarations: [AppHeaderComponent],
      providers: [
        {
          provide: AppExtensionService,
          useValue: appExtensionService
        },
        {
          provide: Store,
          useValue: store
        }
      ]
    });

    store.select.and.callFake((memoizeFn) => of(memoizeFn({ app })));

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should set header color, header text color, name and logo', fakeAsync(() => {
    component.appName$.subscribe((val) => expect(val).toBe(app.appName));
    component.logo$.subscribe((val) => expect(val).toBe(app.logoPath));
    component.headerColor$.subscribe((val) => expect(val).toBe(app.headerColor));
    component.headerTextColor$.subscribe((val) => expect(val).toBe(app.headerTextColor));
  }));

  it('should get header actions', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.actions).toEqual(actions);
  }));

  it('should minimize sidenav on toggle sidenav click', () => {
    const layout = TestBed.createComponent(SidenavLayoutComponent);
    const mockData: any = { layout: layout.componentInstance, isMenuMinimized: true };
    component.data = mockData;

    const toggleMenuSpy = spyOn(component.data.layout, 'toggleMenu');
    component.onToggleSidenav(true);

    expect(toggleMenuSpy).toHaveBeenCalled();
    expect(component.isSidenavExpanded).toBe(false);
  });

  describe('Search input', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should search be present when contentService is enabled', () => {
      fixture.detectChanges();
      const searchInput = fixture.debugElement.query(By.css('.aca-search-input'));

      expect(searchInput).not.toBeNull();
    });

    it('should search not be present when contentService is disabled', () => {
      localStorage.setItem('contentService', 'false');
      fixture.detectChanges();
      const searchInput = fixture.debugElement.query(By.css('.aca-search-input'));

      expect(searchInput).toBeNull();
    });
  });
});
