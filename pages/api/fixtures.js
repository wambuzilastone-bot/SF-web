import { getFixtures, getTeamStats } from "../../src/apiFootball";
import { leaguesByCountry } from "../../src/utils";

export default async function handler(req, res) {
  try {
    const season = 2024;
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);

    const from = today.toISOString().split("T")[0];
    const to = end.toISOString().split("T")[0];

    const allFixtures = [];

    for (const country of Object.keys(leaguesByCountry)) {
      for (const league of leaguesByCountry[country]) {
        const fixtures = await getFixtures(league.id, season, from, to);

        for (const fix of fixtures) {
          const homeStats = await getTeamStats(fix.teams.home.id, season);
          const awayStats = await getTeamStats(fix.teams.away.id, season);

          const rsbs = {
            line1: `${fix.teams.home.name} vs ${fix.teams.away.name}`,
            line2: `${homeStats.all.win}${homeStats.all.draw}${homeStats.all.lose} - ${awayStats.all.win}${awayStats.all.draw}${awayStats.all.lose}`,
            line3: `${Math.round((homeStats.all.goals.for / (homeStats.all.goals.against || 1)) * 10)} - ${Math.round((awayStats.all.goals.for / (awayStats.all.goals.against || 1)) * 10)}`,
            line4: `${homeStats.home.win}${homeStats.home.draw}${homeStats.home.lose} - ${awayStats.away.win}${awayStats.away.draw}${awayStats.away.lose}`,
          };

          allFixtures.push({
            country,
            leagueName: league.name,
            fixtureDate: fix.fixture.date,
            rsbs,
          });
        }
      }
    }

    res.status(200).json(allFixtures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
