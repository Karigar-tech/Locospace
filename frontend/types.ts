
export interface ListingPicture {
    data: Buffer;  
    contentType: string;
  }
  
  export interface Listing {
    ListingPictures: ListingPicture[];
    Description: string;
    location: string;
    bedroom: number;
    bath: number;
    kitchen: number;
    price: number;
    listing_type: string;
  }
  