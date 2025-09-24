// src/apiFootball.js
import axios from "axios";

const API_URL = "https://v3.football.api-sports.io";
const API_KEY = process.env.NEXT_PUBLIC_API_FOOTBALL_KEY; // Set in Vercel env vars

const client = axios.create({
  baseURL: API_URL,
  headers: { "x-apisports-key": API_KEY },
});

// Fetch leagues (optional)
export async function getAvailableLeagues() {
  const res = await client.get("/leagues");
  return res.data.response;
}

// Fetch fixtures for a league between 'from' and 'to' dates
export async function getFixtures(leagueId, season, from, to) {
  const params = { league: leagueId, season, from, to };
  const res = await client.get("/fixtures", { params });
  return res.data.response;
}

// Fetch team statistics
export async function getTeamStats(teamId, season) {
  const res = await client.get("/teams/statistics", { params: { team: teamId, season } });
  return res.data.response[0];
}
