export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5",
        input: `
폐기물 작업 포스팅을 작성해줘.

조건:
- "작업했습니다" 말투
- 전후 비교 자연스럽게
- 과장 없이 현실적인 느낌
- 현장 전문가 느낌
        `,
      }),
    });

    const data = await response.json();

    res.status(200).json({
      result: data.output[0].content[0].text,
    });
  } catch (e) {
    res.status(500).json({ error: "에러 발생" });
  }
}
