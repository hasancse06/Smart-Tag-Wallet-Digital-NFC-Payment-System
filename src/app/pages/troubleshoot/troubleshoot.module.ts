import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TroubleshootPageRoutingModule } from './troubleshoot-routing.module';

import { TroubleshootPage } from './troubleshoot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TroubleshootPageRoutingModule
  ],
  declarations: [TroubleshootPage]
})
export class TroubleshootPageModule {}
