import { FeatureCollection, Point } from 'geojson';
import { v4 as uuidv4 } from 'uuid';

import { RealEstateSummary } from '../../store/real-estate/models/real-estate-summary.model';

const thumbnail = 'https://assets.dnainfo.com/generated/photo/2015/12/asap-extell-renderings-1449249738.jpg/extralarge.jpg';

export const DUMMY_REAL_ESTATES: FeatureCollection<Point, RealEstateSummary> = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-97.662277, 30.281602] }, properties: { id: uuidv4(), address: 'Austin, Texas', info: '1 Bedroom', price: 1250, thumbnail } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-97.664277, 30.283602] }, properties: { id: uuidv4(), address: 'Austin, Texas', info: '1 Bedroom', price: 1250, thumbnail } },
  ]
};
