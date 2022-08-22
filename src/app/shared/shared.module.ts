import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapEditorComponent } from './components/map-editor/map-editor.component';
import { RealEstateSummaryCardComponent } from './components/real-estate-summary-card/real-estate-summary-card.component';
import { RealEstateCardComponent } from './components/real-estate-card/real-estate-card.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';



@NgModule({
  declarations: [
    MapEditorComponent,
    RealEstateSummaryCardComponent,
    RealEstateCardComponent
  ],
  imports: [
    CommonModule,
    MdbAccordionModule,
    MdbTabsModule
  ],
  exports: [
    MapEditorComponent,
    RealEstateSummaryCardComponent,
    RealEstateCardComponent
  ]
})
export class SharedModule { }
