import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create or get the price first
    let price
    try {
      const prices = await stripe.prices.list({ 
        limit: 10,
        active: true
      })
      price = prices.data.find(p => p.unit_amount === 2000) // $20.00
      
      if (!price) {
        // Create product first
        const product = await stripe.products.create({
          name: 'PrepMate Pro',
          description: 'Unlimited interview practice with advanced AI feedback',
        })
        
        // Create price
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: 2000, // $20.00 in cents
          currency: 'usd',
          recurring: {
            interval: 'month',
          },
        })
      }
    } catch (error) {
      console.error('Error creating price:', error)
      return NextResponse.json({ error: 'Failed to create price' }, { status: 500 })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/dashboard?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id || '',
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}