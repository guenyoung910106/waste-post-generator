export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>폐기물 포스팅 생성기</h1>
      <button onClick={generate}>대본 만들기</button>
      <pre id="result"></pre>
    </div>
  );
}

async function generate() {
  const res = await fetch("/api/generate", {
    method: "POST",
  });
  const data = await res.json();
  document.getElementById("result").innerText = data.result;
}
