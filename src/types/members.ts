export type TMemberProfile = {
  id: string;
  name: string;
  avatar: string | null;
  joinDate: string;
  bio: string | null;
  location: string | null;
  role: "FAN" | "JOURNALIST";
  favoriteTeamId: number | null;
  favoriteTeamName: string | null;
  outlet: string | null;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    following: number;
    followers: number;
  };
  badges: string[];
  isOwnProfile: boolean;
};
