export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: {
    subscriptionDetails: {
      id: string;
      status: string;
      planType: string;
      startDate: string;
      endDate: string;
      price: number;
      paymentVerificationId: string;
    };
  };
  Subscription: undefined;
  PaymentSubs: {
    subscriptionId: string;
    amount: number;
    planType: "monthly" | "yearly";
  };
  EditProfile: undefined;
  ProfileSetting: undefined;
  ProfileSubs: undefined;
  ProfileSubsPayment: undefined;
  ProfileNotification: undefined;
  MovieDetail: { id: string | number };
  TvShowDetail: { id: string | number };
  Streaming: {
    movieId: string | number;
    movieTitle?: string;
    type?: "movie" | "tvshow";
  };
  Main: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

export interface Movie {
  id: number | string;
  image: any;
  title: string;
  genres?: string[];
  type?: "movie" | "tvshow";
  vote_average?: number;
  backdrop_path?: string;
  poster_path?: string;
  overview: string;
  release_date: string;
}

export interface MovieDetails {
  title: string;
  description: string;
  rating: string;
  languages: string[];
  year: number;
  runtime: string;
  genres: string[];
  image: any;
}

export interface TvShow {
  image: any;
  title: string;
  genres?: string[];
}

export interface TvShowDetails {
  id?: number | string;
  title: string;
  description: string;
  rating: string;
  languages: string[];
  year: number;
  runtime: string;
  Director: string;
  Writer: string;
  DOP: string;
  genres: string[];
  image: any;
}

export interface Episode {
  id: number;
  title: string;
  still_path?: string | null;
  duration: string;
  thumbnail: any;
}

export interface ContinueWatchingItem extends Movie {
  progress: string | number;
}

export interface ImageMovie {
  carnageImage: any;
  spaceHero: any;
  redDoctors: any;
}

export interface ImageCast {
  meira: any;
  alfonz: any;
  adriano: any;
  sulthon: any;
}