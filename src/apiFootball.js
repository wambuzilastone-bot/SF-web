import axios from "axios";

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY; // Set in Vercel

const client = axios.create({
  baseURL: API_URL,
  headers: { "x-apisports-key": API_KEY },
});

export async function getFixtures(leagueId, season, from, to) {
  const res = await client.get("/fixtures", {
    params: { league: leagueId, season, from, to },
  });
  return res.data.response;
}

export async function getTeamStats(teamId, season) {
  const res = await client.get("/teams/statistics", {
    params: { team: teamId, season },
  });
  return res.data.response[0];
}
