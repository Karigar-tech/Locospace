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
  ListingPictures: string[];
  Description: string;
  location: string;
  bedroom: number;
  bath: number;
  kitchen: number;
  price: number;
  listing_type: string;
  area: number;
  preferences: string[];
  user: User;
}






