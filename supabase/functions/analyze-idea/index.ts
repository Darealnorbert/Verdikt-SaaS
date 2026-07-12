import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { idea_text } = await req.json()

    // 1. Setup Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Get user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 3. Call Groq API (free, no credit card needed)
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) throw new Error('Missing GROQ_API_KEY')

    const systemPrompt = `You are a brutally honest startup idea analyst. Your job is NOT to encourage — it is to give a cold, realistic assessment based on market evidence.

CRITICAL RULES:
- DO NOT be encouraging or diplomatic. Founders need the truth, not validation.
- Most startup ideas fail. Reflect this in your scores. Score 70+ is RARE and must be truly justified.
- If an idea targets an already saturated market (productivity, note-taking, invoicing, CRM, fitness, etc.), give it a low score EVEN if the niche sounds specific.
- If the idea has no clear monetization or is "Uber for X" without a twist, score it below 40.
- Do NOT pad risks or competitors with generic answers. Be specific and harsh.
- A score between 50-70 should be the EXCEPTION, not the norm. Most ideas land between 20-50.
- THE OUTPUT MUST BE ENTIRELY IN FRENCH (except for the JSON keys which must remain in English).

Score distribution you should aim for:
- 0-33 (kill): Saturated market, weak demand, no differentiator → verdict: kill
- 34-69 (pivot): Some signal but major flaws → verdict: pivot
- 70-100 (build): Genuine gap, strong monetization, defensible angle → verdict: build

Return ONLY a valid JSON object with no markdown, no explanation, with all string values in FRENCH:
{
  "score": <integer 0-100>,
  "verdict": "<build | pivot | kill>",
  "market_size": "<honest assessment of market size and whether it's worth targeting>",
  "competitors": ["<specific real competitor 1>", "<specific real competitor 2>", "<specific real competitor 3>"],
  "risks": ["<specific critical risk 1>", "<specific critical risk 2>", "<specific critical risk 3>"],
  "action_plan": "<only if verdict is build or pivot: concrete next step. If kill, explain precisely why this is not worth pursuing.>"
}`

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this startup idea: "${idea_text}"` }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      })
    })

    const groqData = await groqResponse.json()
    console.log('Groq response status:', groqResponse.status)
    console.log('Groq response:', JSON.stringify(groqData).slice(0, 500))

    if (!groqResponse.ok || !groqData.choices?.[0]?.message?.content) {
      const errMsg = groqData.error?.message || JSON.stringify(groqData)
      throw new Error(`Groq API error: ${errMsg}`)
    }

    const content = groqData.choices[0].message.content

    // Parse JSON — handle potential markdown code blocks
    let analysisResult
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisResult = JSON.parse(cleaned)
    } catch {
      throw new Error(`Failed to parse AI response: ${content}`)
    }

    // Validate required fields
    if (typeof analysisResult.score !== 'number') throw new Error('Invalid score from AI')
    if (!['build', 'pivot', 'kill'].includes(analysisResult.verdict)) {
      analysisResult.verdict = analysisResult.score >= 67 ? 'build' : analysisResult.score >= 34 ? 'pivot' : 'kill'
    }

    // 4. Save to database
    const { data: analysis, error } = await supabaseClient
      .from('analyses')
      .insert({
        user_id: user.id,
        idea_text,
        score: analysisResult.score,
        verdict: analysisResult.verdict,
        report: {
          market_size: analysisResult.market_size || '',
          competitors: analysisResult.competitors || [],
          risks: analysisResult.risks || [],
          action_plan: analysisResult.action_plan || ''
        }
      })
      .select()
      .single()

    if (error) throw new Error(`DB error: ${error.message}`)

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Edge function error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
