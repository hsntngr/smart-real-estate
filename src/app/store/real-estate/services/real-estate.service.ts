import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RealEstateListResponse, RealEstateProperty } from '@store/real-estate/models';

@Injectable({ providedIn: 'root' })
export class RealEstateService {
  constructor(private readonly http: HttpClient) {
  }

  getLists(listId: number, token: string): Observable<RealEstateListResponse> {
    return this.http.get<RealEstateListResponse>(`List/json/listItems.aspx`, {
      params: { listID: listId, token }
    })
  }

  getPropertyItems(listId: number, propertyId: number, token: string) {
    return this.http.get<RealEstateProperty>(`List/json/propertyItem.aspx`, {
      params: { listID: listId, propertyID: propertyId, token }
    })
  }
}
