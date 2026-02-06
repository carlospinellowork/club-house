/**
 * API-Football Integration
 * Free tier: 100 requests/day
 * Documentation: https://www.api-football.com/documentation-v3
 */

const API_BASE_URL = 'https://v3.football.api-sports.io';
const API_KEY = process.env.FOOTBALL_API_KEY || '';

interface ApiFootballResponse<T> {
  get: string;
  parameters: Record<string, any>;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

export interface Team {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface TeamSearchResult {
  team: Team;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
}

export interface Fixture {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface Standing {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  home: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  away: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
  update: string;
}

class FootballAPI {
  private async fetch<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Football API error: ${response.statusText}`);
    }

    const data: ApiFootballResponse<T> = await response.json();
    
    if (data.errors && data.errors.length > 0) {
      throw new Error(`Football API error: ${JSON.stringify(data.errors)}`);
    }

    return data.response;
  }

  /**
   * Search teams by name
   * @param search - Team name to search
   * @param country - Optional country filter
   */
  async searchTeams(search: string, country?: string): Promise<TeamSearchResult[]> {
    return this.fetch<TeamSearchResult[]>('/teams', {
      search,
      country,
    });
  }

  /**
   * Get team by ID
   * @param teamId - Team ID
   */
  async getTeam(teamId: number): Promise<TeamSearchResult | null> {
    const results = await this.fetch<TeamSearchResult[]>('/teams', { id: teamId });
    return results[0] || null;
  }

  /**
   * Get next fixtures for a team
   * @param teamId - Team ID
   * @param limit - Number of fixtures to return (default: 5)
   */
  async getNextFixtures(teamId: number, limit: number = 5): Promise<Fixture[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.fetch<Fixture[]>('/fixtures', {
      team: teamId,
      from: today,
      next: limit,
    });
  }

  /**
   * Get last fixtures for a team
   * @param teamId - Team ID
   * @param limit - Number of fixtures to return (default: 5)
   */
  async getLastFixtures(teamId: number, limit: number = 5): Promise<Fixture[]> {
    return this.fetch<Fixture[]>('/fixtures', {
      team: teamId,
      last: limit,
    });
  }

  /**
   * Get current standings for a team's league
   * @param teamId - Team ID
   * @param season - Season year (default: current year)
   */
  async getStandings(teamId: number, season?: number): Promise<Standing[]> {
    const currentSeason = season || new Date().getFullYear();
    const results = await this.fetch<Array<{ league: { standings: Standing[][] } }>>('/standings', {
      team: teamId,
      season: currentSeason,
    });
    
    // API returns nested arrays, flatten them
    return results[0]?.league?.standings?.flat() || [];
  }

  /**
   * Get live fixtures
   */
  async getLiveFixtures(): Promise<Fixture[]> {
    return this.fetch<Fixture[]>('/fixtures', { live: 'all' });
  }

  /**
   * Get fixtures by date
   * @param date - Date in YYYY-MM-DD format
   */
  async getFixturesByDate(date: string): Promise<Fixture[]> {
    return this.fetch<Fixture[]>('/fixtures', { date });
  }
}

export const footballAPI = new FootballAPI();
