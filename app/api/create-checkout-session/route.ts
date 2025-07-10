import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabaseServer'

// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-01' })

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Implement Stripe checkout session creation
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [{
    //     price_data: {
    //       currency: 'usd',
    //       product_data: { 
    //         name: 'CELPIP Practice Test',
    //         description: 'Unlimited access to CELPIP writing practice tests'
    //       },
    //       unit_amount: 1000, // $10.00
    //     },
    //     quantity: 1,
    //   }],
    //   mode: 'payment',
    //   success_url: `${request.headers.get('origin')}/success`,
    //   cancel_url: `${request.headers.get('origin')}/cancel`,
    //   customer_email: user.email,
    //   metadata: {
    //     user_id: user.id
    //   }
    // })
    
    // return NextResponse.json({ url: session.url })

    // For now, return a mock response
    return NextResponse.json({
      message: 'Payment integration coming soon',
      mock_url: `${request.headers.get('origin')}/success`
    })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 