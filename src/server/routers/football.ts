import { footballAPI } from "@/lib/football-api";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const footballRouter = router({
  /**
   * Search teams by name
   */
  searchTeams: publicProcedure
    .input(
      z.object({
        search: z.string().min(2, "Digite pelo menos 2 caracteres"),
        country: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const teams = await footballAPI.searchTeams(input.search, input.country);
        return teams.map((result) => ({
          id: result.team.id,
          name: result.team.name,
          logo: result.team.logo,
          country: result.team.country,
          founded: result.team.founded,
          venue: result.venue.name,
          city: result.venue.city,
        }));
      } catch (error) {
        console.error("Error searching teams:", error);
        return [];
      }
    }),

  /**
   * Get team details by ID
   */
  getTeam: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const team = await footballAPI.getTeam(input.teamId);
        if (!team) return null;

        return {
          id: team.team.id,
          name: team.team.name,
          logo: team.team.logo,
          country: team.team.country,
          founded: team.team.founded,
          national: team.team.national,
          venue: {
            name: team.venue.name,
            city: team.venue.city,
            capacity: team.venue.capacity,
            image: team.venue.image,
          },
        };
      } catch (error) {
        console.error("Error getting team:", error);
        return null;
      }
    }),

  /**
   * Get next fixtures for a team
   */
  getNextFixtures: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const fixtures = await footballAPI.getNextFixtures(input.teamId, input.limit);
        return fixtures.map((fixture) => ({
          id: fixture.fixture.id,
          date: fixture.fixture.date,
          timestamp: fixture.fixture.timestamp,
          status: fixture.fixture.status,
          league: {
            name: fixture.league.name,
            logo: fixture.league.logo,
            country: fixture.league.country,
          },
          home: {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name,
            logo: fixture.teams.home.logo,
          },
          away: {
            id: fixture.teams.away.id,
            name: fixture.teams.away.name,
            logo: fixture.teams.away.logo,
          },
          venue: fixture.fixture.venue,
        }));
      } catch (error) {
        console.error("Error getting next fixtures:", error);
        return [];
      }
    }),

  /**
   * Get last fixtures for a team
   */
  getLastFixtures: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ input }) => {
      try {
        const fixtures = await footballAPI.getLastFixtures(input.teamId, input.limit);
        return fixtures.map((fixture) => ({
          id: fixture.fixture.id,
          date: fixture.fixture.date,
          status: fixture.fixture.status,
          league: {
            name: fixture.league.name,
            logo: fixture.league.logo,
          },
          home: {
            id: fixture.teams.home.id,
            name: fixture.teams.home.name,
            logo: fixture.teams.home.logo,
            winner: fixture.teams.home.winner,
          },
          away: {
            id: fixture.teams.away.id,
            name: fixture.teams.away.name,
            logo: fixture.teams.away.logo,
            winner: fixture.teams.away.winner,
          },
          goals: fixture.goals,
        }));
      } catch (error) {
        console.error("Error getting last fixtures:", error);
        return [];
      }
    }),

  /**
   * Get standings for a team
   */
  getStandings: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        season: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const standings = await footballAPI.getStandings(input.teamId, input.season);
        return standings.map((standing) => ({
          rank: standing.rank,
          team: {
            id: standing.team.id,
            name: standing.team.name,
            logo: standing.team.logo,
          },
          points: standing.points,
          goalsDiff: standing.goalsDiff,
          form: standing.form,
          played: standing.all.played,
          won: standing.all.win,
          draw: standing.all.draw,
          lost: standing.all.lose,
          goalsFor: standing.all.goals.for,
          goalsAgainst: standing.all.goals.against,
        }));
      } catch (error) {
        console.error("Error getting standings:", error);
        return [];
      }
    }),

  /**
   * Get live fixtures
   */
  getLiveFixtures: publicProcedure.query(async () => {
    try {
      const fixtures = await footballAPI.getLiveFixtures();
      return fixtures.map((fixture) => ({
        id: fixture.fixture.id,
        status: fixture.fixture.status,
        league: {
          name: fixture.league.name,
          logo: fixture.league.logo,
          country: fixture.league.country,
        },
        home: {
          id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo,
        },
        away: {
          id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo,
        },
        goals: fixture.goals,
      }));
    } catch (error) {
      console.error("Error getting live fixtures:", error);
      return [];
    }
  }),
});
