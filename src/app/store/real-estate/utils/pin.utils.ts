import { RealEstateListItem } from '@store/real-estate/models';
import { Feature, FeatureCollection, Point } from 'geojson';
import { RealEstateGeoJSONProperties } from '@store/real-estate/models/real-estate-geojson-properties.model';

export function createPinFeatureCollectionFromRealEstateList(items: RealEstateListItem[]): FeatureCollection<Point, RealEstateGeoJSONProperties> {
  const features: Feature<Point, RealEstateGeoJSONProperties>[] = items.map(x => {
    const { propertyID, floorplans, favorite } = x;
    const priceList = floorplans.map(x => x.price);
    const minPrice = Math.min(...priceList);
    const maxPrice = Math.max(...priceList);
    const { Longitude, Latitude } = x.geocode;
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [+Longitude, +Latitude] },
      properties: { id: propertyID, price: `$${minPrice} - $${maxPrice}`, favorite, selected: false }
    };
  });

  return { type: 'FeatureCollection', features };
}
