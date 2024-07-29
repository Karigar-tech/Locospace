export interface User {
  address: string;
  contact: string;
  email: string;
  name: string;
  profilePicture: {
    filePath: string;
    url: string;
};
}
export interface Listing {
  _id: number;
  ListingPictures: string[];
  adTitle: string;
  Description: string;
  location: string;
  bedroom: number;
  bath: number;
  kitchen: number;
  price: number;
  listing_type: string;
  areasize: number;
  areaunit: string;
  area: string;
  preferences: {
    environment: string[];
    facilities: string[];
    ageGroup: string[];
  
  }
  user: User;
}






