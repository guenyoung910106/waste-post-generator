import { useState } from "react";

const wasteTypes = [
  "이사폐기물",
  "쓰레기집 정리",
  "고독사정리",
  "유품정리",
  "생활폐기물",
  "대형폐기물",
  "사업장폐기물",
  "건설폐기물",
];

const toneStyles = [
  "친근형",
  "전문형",
  "영업형",
  "현장형",
  "절제형",
];

export default function Home() {
  const [wasteType, setWasteType] = useState("");
  const [toneStyle, setToneStyle] = useState("친근형");
  const [mainPoint, setMainPoint] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!wasteType) {
      alert("폐기물 종류를 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wasteType,
          toneStyle,
          mainPoint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "생성 중 오류가 발생했습니다.");
      }

      setResult(data.result || "결과가 없습니다.");
    } catch (error) {
      setResult(`오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    alert("복사 완료");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>폐기물 포스팅 생성기</h1>
        <p style={styles.desc}>
          폐기물 종류와 말투, 핵심 포인트를 입력하면 포스팅 초안을 생성합니다.
        </p>

        <div style={styles.card}>
          <label style={styles.label}>1. 폐기물 종류</label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            style={styles.select}
          >
            <option value="">선택하세요</option>
            {wasteTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label style={styles.label}>2. 말투</label>
          <select
            value={toneStyle}
            onChange={(e) => setToneStyle(e.target.value)}
            style={styles.select}
          >
            {toneStyles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label style={styles.label}>3. 가장 중요한 포인트</label>
          <input
            type="text"
            value={mainPoint}
            onChange={(e) => setMainPoint(e.target.value)}
            placeholder="예: 물량이 많았지만 빠르게 정리한 점"
            style={styles.input}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "생성 중..." : "대본 만들기"}
          </button>
        </div>

        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <h2 style={styles.resultTitle}>결과 출력</h2>
            <button onClick={handleCopy} style={styles.copyButton}>
              전체 복사
            </button>
          </div>

          <textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            placeholder="여기에 생성된 포스팅이 표시됩니다."
            style={styles.textarea}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "20px",
    fontFamily:
      'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "8px",
    color: "#111827",
  },
  desc: {
    color: "#6b7280",
    marginBottom: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: "16px",
  },
  resultCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  label: {
    display: "block",
    fontWeight: 700,
    marginTop: "12px",
    marginBottom: "8px",
    color: "#111827",
  },
  select: {
    width: "100%",
    height: "48px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    padding: "0 14px",
    fontSize: "15px",
    background: "#fff",
  },
  input: {
    width: "100%",
    height: "48px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    padding: "0 14px",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    height: "52px",
    marginTop: "18px",
    border: "none",
    borderRadius: "14px",
    background: "#111827",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  resultTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
  },
  copyButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  textarea: {
    width: "100%",
    minHeight: "500px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    padding: "16px",
    fontSize: "15px",
    lineHeight: 1.8,
    boxSizing: "border-box",
    resize: "vertical",
    background: "#f8fafc",
  },
};
