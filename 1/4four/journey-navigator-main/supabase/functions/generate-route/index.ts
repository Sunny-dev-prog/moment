// Edge Function: 生成北疆12天自驾路况数据
// 使用 Lovable AI Gateway + tool calling 强制结构化输出

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `你是新疆北疆自驾路线规划师，对北疆地理与公路状况非常熟悉。
基于"阿勒泰进 · 伊宁出"的12天经典环线，按以下顺序输出每天的真实公里数、行车时长、路况难度。
顺序：
D1 阿勒泰机场 → 阿勒泰市
D2 阿勒泰市 → 可可托海
D3 可可托海 → 布尔津
D4 布尔津 → 喀纳斯
D5 喀纳斯深度游（环线+换乘）
D6 喀纳斯 → 禾木
D7 禾木 → 乌尔禾·克拉玛依
D8 克拉玛依 → 赛里木湖
D9 赛里木湖 → 伊宁
D10 伊宁市区游览
D11 伊宁 → 那拉提
D12 那拉提 → 伊宁机场

要求：
- 公里数 (km) 必须符合真实地理距离（整数）
- 行车时长 (hours) 是合理估算（小数，1位）
- 难度 difficulty 仅取 "low" | "mid" | "high"
  · low: 高速/国道直道为主
  · mid: 缓弯/河谷/草原公路
  · high: 盘山公路/山口/戈壁烂路
- roadType: 8字以内的中文路段类型描述
- highlight: 12字以内的一句话亮点`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const tools = [
      {
        type: "function",
        function: {
          name: "submit_route_plan",
          description: "提交北疆12天自驾路况数据",
          parameters: {
            type: "object",
            properties: {
              days: {
                type: "array",
                minItems: 12,
                maxItems: 12,
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "D1-D12" },
                    from: { type: "string" },
                    to: { type: "string" },
                    km: { type: "number" },
                    hours: { type: "number" },
                    difficulty: { type: "string", enum: ["low", "mid", "high"] },
                    roadType: { type: "string" },
                    highlight: { type: "string" },
                  },
                  required: [
                    "id", "from", "to", "km", "hours",
                    "difficulty", "roadType", "highlight",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["days"],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content:
                "请基于真实地理数据，输出12天的完整路况规划，调用 submit_route_plan。",
            },
          ],
          tools,
          tool_choice: {
            type: "function",
            function: { name: "submit_route_plan" },
          },
        }),
      },
    );

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 额度已用完，请到工作区添加额度" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      throw new Error(`AI gateway returned ${aiResp.status}`);
    }

    const data = await aiResp.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("AI 未返回结构化数据");
    }
    const args = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(args), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-route error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
