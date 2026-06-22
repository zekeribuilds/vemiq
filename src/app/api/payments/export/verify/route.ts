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

    const supabase = await createClient();

    // Check if payment has already been processed (replay attack protection)
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('reference', reference)
      .single();

    if (existingPayment && existingPayment.status === 'completed') {
      return NextResponse.json(
        { 
          error: 'Payment has already been processed',
          status: existingPayment.status,
          paidAt: existingPayment.paid_at
        },
        { status: 409 }
      );
    }

    const paystackService = getPaystackService();
    const response = await paystackService.verifyTransaction(reference);

    if (response.status && response.data.status === 'success') {
      // Update payment record
      const { data: paymentData, error: updateError } = await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          paid_at: new Date().toISOString(),
        })
        .eq('reference', reference)
        .eq('status', 'pending')
        .select()
        .single();

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update payment record' },
          { status: 500 }
        );
      }

      // Create report version record for export history
      const metadata = paymentData.metadata as any;
      const { error: versionError } = await supabase
        .from('report_versions')
        .insert({
          report_id: metadata.reportId || null,
          user_id: paymentData.user_id,
          version_number: 1,
          pdf_path: null, // Will be set after PDF generation
          page_count: metadata.pageCount,
          amount_paid: paymentData.amount,
          currency: paymentData.currency,
          payment_reference: reference,
          payment_status: 'completed',
          export_type: 'pdf',
          generated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (versionError) {
        console.error('Report version creation error:', versionError);
        // Don't fail the payment verification if version creation fails
      }

      return NextResponse.json({
        status: 'success',
        data: response.data,
        payment: paymentData,
        version: versionError ? null : versionError,
      });
    }

    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Export payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
