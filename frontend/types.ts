import { List } from "postcss/lib/list";

export interface User {
  _id: number;
  address: string;
  contact: string;
  email: string;
  name: string;
  username: string;
  profilePicture: {
    filePath: string;
    url: string;
};
 listingID: string [];
 savedListings: Listing[];
}

export interface Preferences {
  environment: string[];
  facilities: string[];
  ageGroup: string[];
}

export interface Listing {
  _id: number;
  ListingPictures: string[];
  title: string;
  Description: string;
  numberOfStories: number;
  location: string;
  bedroom: number;
  bath: number;
  kitchen: number;
  price: number;
  listing_type: string;
  areasize: number;
  areaunit: string;
  area: string;
  community: string;
  preferences: Preferences;
  user: User;
  
}

export interface Community{
  _id: number;
  communityName:string,
  communityPicture: string,
  communityMembers: number,
  detailedListings: Listing []

}

export interface Thread {
  _id: number;
  user_id: User;
  community_id: Community;
  thread_title: string;
  thread_description: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  document?: string;
}


export interface Reply {
  _id: string;
  user_id: User;
  content: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  document: string;
}

