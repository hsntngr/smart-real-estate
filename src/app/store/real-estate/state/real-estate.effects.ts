import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { RealEstateService } from '../services/real-estate.service';
import * as RealEstateActions from './real-estate.actions';
import * as AgentActions from '@store/agent/state';

@Injectable()
export class RealEstateEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: RealEstateService
  ) {
  }

  fetchListItems$ = createEffect(() => this.actions$.pipe(
      ofType(RealEstateActions.fetchRealEstateList),
      switchMap(({ listId, token }) => this.service.getLists(listId, token).pipe(
        switchMap(({ records, agentInfo }) => of(
          RealEstateActions.setRealEstateList({ payload: records }),
          AgentActions.setAgentInfo({ payload: agentInfo })
        )),
        catchError(err => of(RealEstateActions.errorOccurred(err.error.message)))
      ))
    )
  )

  fetchPropertyDetails$ = createEffect(() => this.actions$.pipe(
      ofType(RealEstateActions.fetchRealEstatePropertyDetails),
      switchMap(({ listId, token, propertyId }) => this.service.getPropertyItems(listId, propertyId, token).pipe(
        map(payload => RealEstateActions.setRealEstatePropertyDetails({ payload })),
        catchError(err => of(RealEstateActions.errorOccurred(err.error.message)))
      ))
    )
  )
}
