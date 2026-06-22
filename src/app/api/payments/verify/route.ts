import { NextRequest, NextResponse } from 'next/server';
import { getPaystackService } from '@/lib/payments/paystackService';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    const paystackService = getPaystackService();
    const response = await paystackService.verifyTransaction(reference);

    if (response.status && response.data.status === 'success') {
      // Update payment record in database
      const supabase = await createClient();

      const { error: updateError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('reference', reference);

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update payment record' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        status: 'success',
        data: response.data,
      });
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
