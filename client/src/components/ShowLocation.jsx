import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ShowLocation = ({ category, onLocationSelect, selectedLocationId }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
    marginTop: '20px',
  };

  const center = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : { lat: 0, lng: 0 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
          setLoading(false);
        },
        () => {
          setError('Unable to retrieve your location. Please check your permissions.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchNearbyDisposalLocations = async () => {
      if (!category || !userLocation || !isLoaded) return;

      setLoading(true);
      try {
        const mapDiv = document.createElement('div');
        const placesService = new window.google.maps.places.PlacesService(mapDiv);

        const searchQueries = {
          'Pet Food': ['pet food donation', 'pet supplies recycling', 'animal shelter'],
          'Fertilizer': ['fertilizer disposal', 'garden waste center', 'chemical disposal'],
          'Animal Farm': ['farm supply recycling', 'agricultural waste', 'livestock supply'],
        };

        const searchTerms = searchQueries[category] || [`${category.toLowerCase()} disposal`, 'recycling center'];

        const results = await Promise.all(
          searchTerms.map((term) =>
            new Promise((resolve) => {
              placesService.nearbySearch(
                {
                  location: new window.google.maps.LatLng(userLocation.latitude, userLocation.longitude),
                  radius: 15000,
                  keyword: term,
                },
                (places, status) => resolve(status === 'OK' ? places : [])
              );
            })
          )
        );

        const uniquePlaces = [];
        const seenIds = new Set();

        results.flat().forEach((place) => {
          if (!seenIds.has(place.place_id)) {
            seenIds.add(place.place_id);
            uniquePlaces.push(place);
          }
        });

        const formatted = uniquePlaces.map((place) => {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          return {
            id: place.place_id,
            name: place.name,
            description: generateDescription(place, category),
            rating: place.rating || '-',
            reviewCount: place.user_ratings_total || 0,
            address: place.vicinity || 'Address unavailable',
            latitude: lat,
            longitude: lng,
            distance: calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng).toFixed(1),
          };
        });

        setLocations(formatted.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch disposal locations. Please try again later.');
        setLoading(false);
      }
    };

    fetchNearbyDisposalLocations();
  }, [category, userLocation, isLoaded]);

  const generateDescription = (place, category) => {
    const readable = place.types?.filter(
      (type) => !['point_of_interest', 'establishment'].includes(type)
    ).map(type =>
      type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    ) || [];

    return readable.length
      ? `${readable.join(', ')} - May accept ${category.toLowerCase()}`
      : `Potential disposal location for ${category.toLowerCase()}`;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (loading || !isLoaded) {
    return <p className="text-gray-600">Loading map and nearby locations...</p>;
  }

  if (error || loadError) {
    return <p className="text-red-600">{error || 'Error loading map'}</p>;
  }

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white">
      <h3 className="text-xl font-semibold mb-4">Disposal Locations for {category}</h3>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{ fullscreenControl: false, streetViewControl: false, mapTypeControl: false }}
      >
        {userLocation && (
          <Marker
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            onClick={() => {
              setSelectedLocation(loc);
              onLocationSelect(loc);
            }}
          />
        ))}
        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div>
              <h4 className="font-bold">{selectedLocation.name}</h4>
              <p>{selectedLocation.description}</p>
              <p>{selectedLocation.address}</p>
              <p>{selectedLocation.rating} ⭐ ({selectedLocation.reviewCount} reviews)</p>
              <p>{selectedLocation.distance} mi away</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="mt-4">
        <h4 className="text-lg font-medium mb-2">Nearby Locations</h4>
        <div className="space-y-3">
          {locations.map((loc) => {
            const isSelected = selectedLocationId === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocation(loc);
                  onLocationSelect(loc);
                }}
                className={`p-3 border rounded-md cursor-pointer transition-all ${
                  isSelected ? 'bg-green-50 border-green-400 shadow' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h5 className="font-semibold">{loc.name}</h5>
                    <p className="text-sm text-gray-600">{loc.description}</p>
                    <p className="text-sm text-gray-500">{loc.address}</p>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-green-600 font-medium">{loc.distance} mi</span>
                    <div className="text-gray-500">{loc.rating} ⭐</div>
                    {isSelected && <div className="text-green-600 font-bold mt-1">✅ Selected</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShowLocation;
