// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFixtures() {
      try {
        const res = await fetch("/api/fixtures");
        const data = await res.json();
        setFixtures(data.fixtures || []);
      } catch (err) {
        setError("Failed to fetch fixtures.");
      } finally {
        setLoading(false);
      }
    }

    fetchFixtures();
  }, []);

  if (loading) return <p>Loading fixtures...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>RSBS Fixtures (Next 7 Days)</h1>
      {fixtures.map((fx) => (
        <div key={fx.fixture.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
          <strong>{fx.rsbs.line1}</strong>
          <br />
          {fx.rsbs.line2} <br />
          {fx.rsbs.line3} <br />
          {fx.rsbs.line4} <br />
          <em>{new Date(fx.fixture.date).toLocaleString()}</em>
        </div>
      ))}
    </div>
  );
}
