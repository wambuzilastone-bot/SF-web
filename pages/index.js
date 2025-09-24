import { useEffect, useState } from "react";
import {
  getFixtures,
  getTeamStats,
  getLeagueStandings,
} from "../src/apiFootball";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pick your league + season
  const leagueId = 39; // Premier League
  const season = 2024;

  useEffect(() => {
    async function loadFixtures() {
      try {
        const today = new Date();
        const from = today.toISOString().split("T")[0]; // YYYY-MM-DD
        const toDate = new Date();
        toDate.setDate(today.getDate() + 7); // Next 7 days
        const to = toDate.toISOString().split("T")[0];

        // ✅ Get fixtures
        const fixturesData = await getFixtures(leagueId, season, from, to);

        // Optionally fetch standings
        const standings = await getLeagueStandings(leagueId, season);

        // Enrich each fixture with stats
        const enrichedFixtures = await Promise.all(
          fixturesData.map(async (fix) => {
            const homeStats = await getTeamStats(fix.teams.home.id, season);
            const awayStats = await getTeamStats(fix.teams.away.id, season);

            return {
              ...fix,
              homeStats,
              awayStats,
              standings,
            };
          })
        );

        setFixtures(enrichedFixtures);
      } catch (err) {
        console.error("Error loading fixtures:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFixtures();
  }, []);

  // ✅ RSBS Calculator
  function calculateRSBS(home, away) {
    if (!home || !away) return null;

    // Line 1: Matchup
    const line1 = `${home.team.name} vs ${away.team.name}`;

    // Line 2: WDL (total record)
    const line2 = `${home.fixtures.wins.total}${home.fixtures.draws.total}${home.fixtures.loses.total} - ${away.fixtures.wins.total}${away.fixtures.draws.total}${away.fixtures.loses.total}`;

    // Line 3: Goal ratio (GF/GA × 10)
    const homeGR = Math.round(
      (home.goals.for.total.total / (home.goals.against.total.total || 1)) * 10
    );
    const awayGR = Math.round(
      (away.goals.for.total.total / (away.goals.against.total.total || 1)) * 10
    );
    const line3 = `${homeGR} - ${awayGR}`;

    // Line 4: Home WDL vs Away WDL
    const line4 = `${home.fixtures.wins.home}${home.fixtures.draws.home}${home.fixtures.loses.home} - ${away.fixtures.wins.away}${away.fixtures.draws.away}${away.fixtures.loses.away}`;

    return { line1, line2, line3, line4 };
  }

  if (loading) return <p>Loading fixtures...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>⚽ RSBS Fixtures (Next 7 Days)</h1>
      {fixtures.length === 0 ? (
        <p>No fixtures found.</p>
      ) : (
        fixtures.map((fix) => {
          const rsbs = calculateRSBS(fix.homeStats, fix.awayStats);
          if (!rsbs) return null;

          return (
            <div
              key={fix.fixture.id}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>
                {fix.league?.country} - {fix.league?.name}
              </strong>
              <br />
              <strong>{rsbs.line1}</strong>
              <br />
              {rsbs.line2} <br />
              {rsbs.line3} <br />
              {rsbs.line4} <br />
              <em>{new Date(fix.fixture.date).toLocaleString()}</em>
            </div>
          );
        })
      )}
    </div>
  );
}
