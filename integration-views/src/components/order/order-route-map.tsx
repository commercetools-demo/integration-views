import { FC, useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

type DirectionsRouteProps = {
  origin: string;
  destination: string;
};

const DirectionsRoute: FC<DirectionsRouteProps> = ({ origin, destination }) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!routesLibrary || !map) {
      return;
    }
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) {
      return;
    }
    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => directionsRenderer.setDirections(response));

    return () => directionsRenderer.setMap(null);
  }, [directionsService, directionsRenderer, origin, destination]);

  return null;
};

type Props = {
  apiKey: string;
  origin: string;
  destination: string;
};

const OrderRouteMap: FC<Props> = ({ apiKey, origin, destination }) => {
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: '100%', height: '450px' }}
        defaultCenter={{ lat: 0, lng: 0 }}
        defaultZoom={2}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <DirectionsRoute origin={origin} destination={destination} />
      </Map>
    </APIProvider>
  );
};

export default OrderRouteMap;
