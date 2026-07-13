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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const fedaPaySecret = Deno.env.get('FEDAPAY_SECRET_KEY')
    if (!fedaPaySecret) throw new Error('Missing FEDAPAY_SECRET_KEY')

    // Create FedaPay Transaction
    const origin = req.headers.get('origin') || 'https://verdikt-saas.vercel.app'
    const transactionPayload = {
      description: "Verdikt - Plan Founder (Analyses illimitées)",
      amount: 5000,
      currency: { iso: "XOF" },
      callback_url: `${origin}/dashboard?payment=success`,
      customer: {
        email: user.email
      },
      custom_metadata: {
        user_id: user.id
      }
    }

    const txResponse = await fetch('https://sandbox-api.fedapay.com/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fedaPaySecret}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(transactionPayload)
    })

    if (!txResponse.ok) {
      const errorText = await txResponse.text()
      throw new Error(`FedaPay error: ${errorText}`)
    }

    const txData = await txResponse.json()
    // FedaPay API returns data wrapped in a "v1/transaction" key
    const transactionId = txData['v1/transaction']?.id || txData.transaction?.id

    if (!transactionId) {
      throw new Error(`Could not parse transaction ID from FedaPay response: ${JSON.stringify(txData)}`)
    }

    // Generate payment token
    const tokenResponse = await fetch(`https://sandbox-api.fedapay.com/v1/transactions/${transactionId}/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${fedaPaySecret}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      throw new Error(`FedaPay token error: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    // The response contains a url like "https://checkout.fedapay.com/pay/..."
    return new Response(JSON.stringify({ url: tokenData.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
