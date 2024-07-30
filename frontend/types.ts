import { List } from "postcss/lib/list";

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
  title: string;
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

export interface Community{
  _id: number;
  communityName:string,
  communityPicture: string,
  communityMembers: number,
  communityListings: Listing []

}






