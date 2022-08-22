# Smart Real Estate

Real Estate application list ads and visualize on map using mapbox-gl

## Architecture

- DDD (Domain Driven Design) approach has been used. Instead of strict discrimination of the Infrastructure and the Domain layer. I follow more SPA based logic and merge them under the `store` layer. 
- Each domain has own store and infrastructure and domain components such as model, services, states etc. 
- Application layer introduced as modules which contains lazy loaded modules (features)
- We have also core module where our configurations and application wide definitions declared and stored

## Assessment Requirements

1. State Management - Ngrx state management library has been used. Since the application contains only one future all reducers registered at the root level
2. Mapbox Features - Wrapper Map Editor component created to implement following requirements
   1. Load Pins On Map - Pins registered map using though a wrapper component and mapbox-gl api as asked. 
   2. Zoom in/out specific pin
   3. Change/Replace pins on map on user-selections - Pin can change (can be added, removed and pin's icon can be changed)
   4. Auto Zoom to center map on a group of pins - Pins grouped as clusters and auto zoom features added based on the features group with the cluster
   5. Extra - Spatial Analyses - Used turf library in for the calculations
      1. List visible real estate items on the map
      2. Show nearby real estates in 1-mile radius
      
  
## Deployment
- `docker build -t smart-real-estate`
- `docker run -d --restart always --name sre-instance -p 4200:80 smart-real-estate`

## Notes
- UI Design and Informational components ignored due to focus spatial features and UX
