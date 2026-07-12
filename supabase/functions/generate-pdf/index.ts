import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { jsPDF } from 'https://esm.sh/jspdf@2.5.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { analysis_id } = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Verify auth
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Fetch the analysis
    const { data: analysis, error: fetchError } = await supabaseClient
      .from('analyses')
      .select('*')
      .eq('id', analysis_id)
      .single()

    if (fetchError || !analysis) throw new Error('Analysis not found')
    
    // Ensure the user owns this analysis
    if (analysis.user_id !== user.id) throw new Error('Unauthorized')

    // Generate basic PDF using jsPDF
    const doc = new jsPDF()
    doc.setFontSize(22)
    doc.text('Rapport Verdikt', 20, 20)
    
    doc.setFontSize(16)
    doc.text('Idée:', 20, 40)
    doc.setFontSize(12)
    const splitIdea = doc.splitTextToSize(analysis.idea_text, 170)
    doc.text(splitIdea, 20, 50)
    
    doc.setFontSize(16)
    doc.text(`Score: ${analysis.score}/100`, 20, 70)
    doc.text(`Verdict: ${analysis.verdict.toUpperCase()}`, 20, 80)

    doc.text('Taille du marché:', 20, 100)
    doc.setFontSize(12)
    const splitMarket = doc.splitTextToSize(analysis.report.market_size || 'N/A', 170)
    doc.text(splitMarket, 20, 110)

    const pdfBuffer = doc.output('arraybuffer')

    // Upload to Supabase Storage
    const fileName = `${user.id}/${analysis_id}.pdf`
    const { error: uploadError } = await supabaseClient.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Get signed URL
    const { data: signedUrlData, error: urlError } = await supabaseClient.storage
      .from('reports')
      .createSignedUrl(fileName, 3600) // 1 hour

    if (urlError) throw urlError

    // Save the PDF URL back to the analysis record
    await supabaseClient
      .from('analyses')
      .update({ pdf_url: signedUrlData.signedUrl })
      .eq('id', analysis_id)

    return new Response(JSON.stringify({ url: signedUrlData.signedUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
