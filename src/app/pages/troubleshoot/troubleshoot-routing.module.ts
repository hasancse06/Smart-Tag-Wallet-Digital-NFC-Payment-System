import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TroubleshootPage } from './troubleshoot.page';

const routes: Routes = [
  {
    path: '',
    component: TroubleshootPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TroubleshootPageRoutingModule {}
