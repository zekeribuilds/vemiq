import { NextRequest, NextResponse } from 'next/server';
import { getPaystackService } from '@/lib/payments/paystackService';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, amount, pageCount, reportType, companyName } = body;

    if (!userId || !email || !amount || !pageCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check for existing pending payment for this report to prevent duplicate charges
    if (reportType) {
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .eq('provider', 'paystack')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingPayment) {
        const existingMetadata = existingPayment.metadata as any;
        if (existingMetadata?.reportType === reportType) {
          return NextResponse.json(
            { 
              error: 'Payment already in progress',
              existingPayment: {
                reference: existingPayment.reference,
                createdAt: existingPayment.created_at
              }
            },
            { status: 409 }
          );
        }
      }
    }

    const paystackService = getPaystackService();
    const reference = paystackService.generateReference();

    const { error: dbError } = await supabase.from('payments').insert({
      user_id: userId,
      amount: amount,
      currency: 'NGN',
      status: 'pending',
      reference: reference,
      provider: 'paystack',
      metadata: {
        pageCount,
        reportType,
        companyName,
        paymentType: 'export',
      },
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
        pageCount,
        reportType,
        companyName,
        paymentType: 'export',
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
    console.error('Export payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
