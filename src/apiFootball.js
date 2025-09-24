import axios from "axios";

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY; // set in Vercel env vars

const client = axios.create({
  baseURL: API_URL,
  headers: { "x-apisports-key": API_KEY },
});

// ✅ Get all leagues
export async function getAvailableLeagues() {
  const res = await client.get("/leagues");
  return res.data.response;
}

// ✅ Get fixtures (with from-to date range)
export async function getFixtures(leagueId, season, from, to) {
  const res = await client.get("/fixtures", {
    params: { league: leagueId, season, from, to },
  });
  return res.data.response;
}

// ✅ Get team statistics
export async function getTeamStats(teamId, season) {
  const res = await client.get("/teams/statistics", {
    params: { team: teamId, season },
  });
  return res.data.response;
}

// ✅ Get league standings (⚠ this was missing)
export async function getLeagueStandings(leagueId, season) {
  const res = await client.get("/standings", {
    params: { league: leagueId, season },
  });
  return res.data.response;
}
