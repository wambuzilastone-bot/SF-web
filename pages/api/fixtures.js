// pages/api/fixtures.js
import { getFixtures, getTeamStats } from "@/src/apiFootball";

export default async function handler(req, res) {
  try {
    const season = 2024; // Change season as needed
    const leagueId = 39; // Example: EPL
    const today = new Date().toISOString().split("T")[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const fixtures = await getFixtures(leagueId, season, today, nextWeek);

    // Fetch team stats to calculate RSBS
    const fixturesWithStats = await Promise.all(
      fixtures.map(async (fx) => {
        const homeStats = await getTeamStats(fx.teams.home.id, season);
        const awayStats = await getTeamStats(fx.teams.away.id, season);

        const homeGR = Math.round((homeStats.all.goals.for / (homeStats.all.goals.against || 1)) * 10);
        const awayGR = Math.round((awayStats.all.goals.for / (awayStats.all.goals.against || 1)) * 10);

        return {
          fixture: fx.fixture,
          teams: fx.teams,
          rsbs: {
            line1: `${fx.teams.home.name} vs ${fx.teams.away.name}`,
            line2: `${homeStats.all.win}${homeStats.all.draw}${homeStats.all.lose} - ${awayStats.all.win}${awayStats.all.draw}${awayStats.all.lose}`,
            line3: `${homeGR} - ${awayGR}`,
            line4: `${homeStats.home.win}${homeStats.home.draw}${homeStats.home.lose} - ${awayStats.away.win}${awayStats.away.draw}${awayStats.away.lose}`,
          },
        };
      })
    );

    res.status(200).json({ fixtures: fixturesWithStats });
  } catch (error) {
    console.error("API route error:", error);
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
