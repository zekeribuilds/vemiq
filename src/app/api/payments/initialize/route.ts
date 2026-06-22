import { NextRequest, NextResponse } from 'next/server';
import { getPaystackService } from '@/lib/payments/paystackService';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, amount, planType } = body;

    if (!userId || !email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paystackService = getPaystackService();
    const reference = paystackService.generateReference();

    // Create payment record in database
    const supabase = await createClient();

    const { error: dbError } = await supabase.from('payments').insert({
      user_id: userId,
      amount: amount,
      status: 'pending',
      reference: reference,
      payment_method: 'paystack',
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    // Initialize Paystack transaction
    const response = await paystackService.initializeTransaction({
      amount: amount,
      email: email,
      reference: reference,
      metadata: {
        userId,
        planType,
      },
    });

    if (!response.status) {
      return NextResponse.json(
        { error: response.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: response.data?.authorization_url,
      reference: response.data?.reference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
