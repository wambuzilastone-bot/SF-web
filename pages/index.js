import { useEffect, useState } from "react";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/fixtures");
      const data = await res.json();
      setFixtures(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>RSBS Fixtures (Next 7 Days)</h1>
      {fixtures.map((fix, i) => (
        <div key={i} style={{ marginBottom: "25px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <strong>{fix.country} - {fix.leagueName}</strong><br/>
          <strong>{fix.rsbs.line1}</strong><br/>
          {fix.rsbs.line2}<br/>
          {fix.rsbs.line3}<br/>
          {fix.rsbs.line4}<br/>
          <em>{new Date(fix.fixtureDate).toLocaleString()}</em>
        </div>
      ))}
    </div>
  );
}
