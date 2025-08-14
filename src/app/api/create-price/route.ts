import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    // Create or get the product
    let product
    try {
      const products = await stripe.products.list({ limit: 1 })
      product = products.data.find(p => p.name === 'PrepMate Pro')
      
      if (!product) {
        product = await stripe.products.create({
          name: 'PrepMate Pro',
          description: 'Unlimited interview practice with advanced AI feedback',
        })
      }
    } catch (error) {
      product = await stripe.products.create({
        name: 'PrepMate Pro',
        description: 'Unlimited interview practice with advanced AI feedback',
      })
    }

    // Create or get the price
    let price
    try {
      const prices = await stripe.prices.list({ 
        product: product.id,
        limit: 1 
      })
      price = prices.data.find(p => p.unit_amount === 2000) // $20.00
      
      if (!price) {
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
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 2000, // $20.00 in cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
      })
    }

    return NextResponse.json({ 
      productId: product.id,
      priceId: price.id,
      amount: price.unit_amount,
      currency: price.currency
    })
  } catch (error) {
    console.error('Error creating price:', error)
    return NextResponse.json(
      { error: 'Failed to create price' },
      { status: 500 }
    )
  }
}