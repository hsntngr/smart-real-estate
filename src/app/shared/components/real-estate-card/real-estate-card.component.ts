import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RealEstateListItem, RealEstateProperty } from '@store/real-estate/models';

@Component({
  selector: 'app-real-estate-card',
  templateUrl: './real-estate-card.component.html',
  styleUrls: ['./real-estate-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealEstateCardComponent implements OnInit {
  @Input() property: RealEstateProperty;
  @Input() nearbyRealEstates: RealEstateListItem[];
  @Input() loading: boolean;

  @Output() propertyFavoriteClick = new EventEmitter<RealEstateListItem>();
  @Output() nearbySummaryCardClick = new EventEmitter<RealEstateListItem>();
  @Output() nearbyFavoriteToggleClick = new EventEmitter<RealEstateListItem>();

  constructor() { }

  ngOnInit(): void {
  }

  onSummaryCardClick(summary: RealEstateListItem) {
    this.nearbySummaryCardClick.emit(summary);
  }

  onFavoriteToggleClick(summary: RealEstateListItem) {
    this.nearbyFavoriteToggleClick.emit(summary);
  }

  onFavoriteClick($event: MouseEvent) {
    this.property = { ...this.property, favorite: !this.property.favorite };
    this.propertyFavoriteClick.emit(this.property as unknown as RealEstateListItem)
  }
}
