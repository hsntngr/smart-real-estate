import { CircleLayer, SymbolLayer } from 'mapbox-gl';
import { MapConstants } from '@core/enums/map-constants.enum';

export const PIN_LAYER: SymbolLayer = {
  'id': MapConstants.pinLayerName,
  'type': 'symbol',
  'source': MapConstants.pinSourceName,
  'minzoom': 10,
  'layout': {
    'icon-image': [
      'case',
      ['==', ['get', 'favorite'], true],
      'pin.favorite',
      'pin.default'
    ],
    'text-field': ['get', 'price'],
    'text-font': [
      'Open Sans Semibold',
      'Arial Unicode MS Bold'
    ],
    'text-padding': 10,
    'icon-size': [
      'case',
      ['boolean',['get', 'selected'], true],
      0.65,
      0.5
    ],
    'text-allow-overlap': true,
    'icon-allow-overlap': true,
    'text-size': [
      'case',
      ['boolean',['get', 'selected'], true],
      12,
      11
    ],
    'text-offset': [
      'case',
      ['boolean',['get', 'selected'], true],
      ['literal', [0, -1.75]],
      ['literal', [0, -1.5]],
    ],
    'text-anchor': 'bottom',
  },
  'paint': {
    'text-color': '#4CAF50',
  }
};

export const CLUSTER_LAYER: CircleLayer = {
  id: MapConstants.clusterLayerName,
  type: 'circle',
  source: MapConstants.pinSourceName,
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      5,
      '#f1f075',
      10,
      '#f28cb1'
    ],
    'circle-radius': [
      'step',
      ['get', 'point_count'],
      15,
      5,
      20,
      10,
      25
    ]
  }
}

export const CLUSTER_POINT_COUNT_LAYER: SymbolLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: MapConstants.pinSourceName,
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
}
