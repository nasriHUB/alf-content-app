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

import { AppStore, NavigateLibraryAction } from '@alfresco/aca-shared/store';
import { SiteEntry } from '@alfresco/js-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
import { AppExtensionService, AppHookService, PageComponent } from '@alfresco/aca-shared';
import { DocumentListPresetRef } from '@alfresco/adf-extensions';

@Component({
  templateUrl: './libraries.component.html'
})
export class LibrariesComponent extends PageComponent implements OnInit {
  isSmallScreen = false;

  columns: DocumentListPresetRef[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    private appHookService: AppHookService,
    private breakpointObserver: BreakpointObserver
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.appHookService.libraryDeleted.subscribe(() => this.reload()),
      this.appHookService.libraryUpdated.subscribe(() => this.reload()),
      this.appHookService.libraryLeft.subscribe(() => this.reload()),

      this.breakpointObserver.observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape]).subscribe((result) => {
        this.isSmallScreen = result.matches;
      })
    );

    this.columns = this.extensions.documentListPresets.libraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  }

  handleNodeClick(event: Event) {
    this.navigateTo((event as CustomEvent).detail?.node);
  }
}
