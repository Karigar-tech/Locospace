
export interface ListingPicture {
    data: Buffer;  
    contentType: string;
  }
  
  export interface Listing {
    ListingPictures: ListingPicture[];
    Description: string;
    location: {
      latitude: number;
      longitude: number;
    };
    areaSize: String;
    price: number;
    bedrooms: number;
    bathrooms: number;
    kitchen: number;
    listing_type: string;
    environment: [string];
    proofofownership?:File;
  }

  export interface FormData {
    ListingPictures: ListingPicture[];
    Description: string;
    location: {
      latitude: number;
      longitude: number;
    };
    areaSize: String;
    price: number;
    bedrooms: number;
    bathrooms: number;
    kitchen: number;
    listing_type: string;
    environment: [string];
    ownershipproof: File;
  }