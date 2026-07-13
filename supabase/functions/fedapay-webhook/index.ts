import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hmac } from "https://deno.land/x/crypto@v0.10.0/hmac.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-fedapay-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const fedaPaySecret = Deno.env.get('FEDAPAY_SECRET_KEY')
    if (!fedaPaySecret) throw new Error('Missing FEDAPAY_SECRET_KEY')

    const signature = req.headers.get('x-fedapay-signature')
    if (!signature) {
      throw new Error('Missing signature header')
    }

    const payload = await req.text()
    
    // Verify signature
    const computedSignature = hmac("sha256", fedaPaySecret, payload, "utf8", "hex");
    if (computedSignature !== signature) {
      throw new Error('Invalid signature')
    }

    const event = JSON.parse(payload)

    if (event.name === 'transaction.approved') {
      const transaction = event.entity
      const userId = transaction.custom_metadata?.user_id

      if (userId) {
        // Initialize Supabase admin client to bypass RLS
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Update user plan
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ plan: 'founder' })
          .eq('id', userId)

        if (error) throw error
        console.log(`Plan updated to founder for user ${userId}`)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
