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
  Description: string;
  location: string;
  bedroom: number;
  bath: number;
  kitchen: number;
  price: number;
  listing_type: string;
  area: number;
  preferences: {
    environment: string[];
    facilities: string[];
    ageGroup: string[];
  
  }
  user: User;
}






