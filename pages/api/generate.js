export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  try {
    const { wasteType, toneStyle, mainPoint } = req.body;

    if (!wasteType) {
      return res.status(400).json({ error: "폐기물 종류가 필요합니다." });
    }

    const prompt = `
너는 한국어 폐기물 포스팅 작성 전문가다.

아래 조건으로 실제 현장 후기 느낌의 블로그 포스팅을 작성해라.

[입력값]
- 폐기물 종류: ${wasteType}
- 말투: ${toneStyle}
- 가장 중요한 포인트: ${mainPoint || "없음"}

[작성 조건]
- 한국어로 작성
- 제목 1개 포함
- 도입문 1개
- 본문 소제목 3개 이상
- 마무리 문단 포함
- 너무 과장하지 말고 자연스럽게
- 실제 작업 후기처럼 써라
- "작업했습니다", "정리했습니다" 같은 현장형 문장 흐름을 살려라
- 지나치게 광고 티 나지 않게 하되 문의 유도는 약하게 포함해라
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: prompt,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({
        error: data?.error?.message || "OpenAI 호출 중 오류가 발생했습니다.",
      });
    }

    const resultText =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "결과가 비어 있습니다.";

    return res.status(200).json({
      result: resultText,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}
