interface GeocodeResult {
  geometry: {
    lat: number;
    lng: number;
  };
}

interface GeocodeResponse {
  results: GeocodeResult[];
}

const geocodePartialAddress = async (partialAddress: string, apiKey: string): Promise<GeocodeResponse> => {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(partialAddress)}&key=${apiKey}&limit=1&countrycode=PK`;

  console.log('Geocode request URL:', url);

  const response = await fetch(url);

  console.log('Geocode response status:', response.status);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: GeocodeResponse = await response.json();
  console.log('Geocode response data:', data);

  return data;
};

export const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
  console.log('Attempting to geocode address:', address);
  
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) {
    throw new Error('API key is not set');
  }

  const addressParts = address.split(',');

  for (let i = 0; i < addressParts.length; i++) {
    const partialAddress = addressParts.slice(i).join(',').trim();
    
    try {
      console.log('Trying partial address:', partialAddress);
      const data = await geocodePartialAddress(partialAddress, apiKey);

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        console.log('Geocoding successful:', { latitude: lat, longitude: lng });
        return { latitude: lat, longitude: lng };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  }


  const defaultCoordinates = { latitude: 30.3753, longitude: 69.3451 };
  console.log('No results found, returning default coordinates:', defaultCoordinates);
  return defaultCoordinates;
};
