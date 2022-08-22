import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RealEstateListItem } from '@store/real-estate/models/real-estate-list-item.model';

@Component({
  selector: 'app-real-estate-summary-card',
  templateUrl: './real-estate-summary-card.component.html',
  styleUrls: ['./real-estate-summary-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealEstateSummaryCardComponent implements OnInit {
  @Input() summary: RealEstateListItem;

  @Output() favoriteToggleClick = new EventEmitter<RealEstateListItem>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onFavoriteClick($event: MouseEvent) {
    $event.stopPropagation();
    this.favoriteToggleClick.emit(this.summary);
  }
}
