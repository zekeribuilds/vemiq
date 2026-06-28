import { VemiqIcon } from '@/components/VemiqIcon';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { Container, Stack, Grid } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function PricingPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.background.base, margin: 0, padding: 0 }}>
      <Navbar />
      <div style={{ padding: `${spacing.md} ${spacing.md} ${spacing.xl} ${spacing.md}`, paddingTop: spacing['3xl'] }}>
        <Container size="lg">
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h1 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '30px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
              Simple, Fair Pricing
            </h1>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              color: colors.text.secondary,
              maxWidth: '768px',
              margin: '0 auto',
            }}>
              Pay only for the report pages you generate.
            </p>
          </div>

          {/* How Pricing Works */}
          <Card style={{ padding: spacing.xl, marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.md,
              textAlign: 'center',
            }}>
              How Pricing Works
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: colors.text.secondary,
              textAlign: 'center',
              maxWidth: '768px',
              margin: '0 auto',
            }}>
              Vemiq helps you document your industrial training for free. When you're ready to generate report content and export your final report, you pay based on the number of pages generated. This means you only pay for what you actually use.
            </p>
          </Card>

          {/* Pricing Cards */}
          <Grid columns={2} gap="lg" style={{ marginBottom: spacing.xl, maxWidth: '80rem', margin: '0 auto spacing.xl' }}>
            {/* Documentation - Free */}
            <Card style={{ padding: spacing.xl, border: `2px solid ${colors.border}`, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background.surface,
                }}>
                  <div style={{ color: colors.text.secondary }}>
                    <VemiqIcon category="status" name="sparkles" size={18} />
                  </div>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: colors.text.primary,
                  }}>
                    Documentation
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: colors.primary,
                    }}>
                      ₦0
                    </span>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '12px',
                      color: colors.text.secondary,
                    }}>
                      /forever
                    </span>
                  </div>
                </div>
              </div>

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
                marginBottom: spacing.md,
              }}>
                Capture and organize your training records at no cost.
              </p>

              <Stack spacing="sm" style={{ marginBottom: spacing.lg }}>
                {[
                  'Activity logging',
                  'Photo uploads',
                  'Evidence storage',
                  'Report workspace',
                  'Institution selection',
                  'Progress tracking',
                  'Access from anywhere',
                ].map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.background.surface,
                    }}>
                      <div style={{ color: colors.text.secondary }}>
                        <VemiqIcon category="status" name="completed" size={12} />
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: colors.text.secondary,
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </Stack>

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
                marginBottom: spacing.md,
              }}>
                Perfect for documenting your training throughout SWEP or SIWES.
              </p>

              <Link href="/signup">
                <Button fullWidth size="md" variant="ghost">
                  Start Documenting Free
                </Button>
              </Link>
            </Card>

            {/* Report Generation - ₦300/Page */}
            <Card style={{
              padding: spacing.xl,
              border: `2px solid ${colors.primary}`,
              boxShadow: `0 25px 50px -12px ${colors.primary}33`,
              transform: 'scale(1.05)',
              position: 'relative',
            }}>
              <div style={{ textAlign: 'center', marginBottom: spacing.md }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: colors.primary,
                  color: colors.text.primary,
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: '9999px',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: `0 10px 15px -3px ${colors.primary}4D`,
                }}>
                  Pay Per Page
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.info})`,
                }}>
                  <div style={{ color: colors.text.primary }}>
                    <VemiqIcon category="data" name="report" size={18} />
                  </div>
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: colors.text.primary,
                  }}>
                    Report Generation
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: colors.primary,
                    }}>
                      ₦300
                    </span>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '12px',
                      color: colors.text.secondary,
                    }}>
                      /page
                    </span>
                  </div>
                </div>
              </div>

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
                marginBottom: spacing.md,
              }}>
                Generate professional report content from your documented activities.
              </p>

              <Stack spacing="sm" style={{ marginBottom: spacing.lg }}>
                {[
                  'AI-assisted report generation',
                  'Institution-ready formatting',
                  'Structured report sections',
                  'Editable content',
                  'Live report preview',
                  'PDF export',
                  'Download-ready report',
                ].map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${colors.primary}1A`,
                    }}>
                      <div style={{ color: colors.primary }}>
                        <VemiqIcon category="status" name="completed" size={12} />
                      </div>
                    </div>
                    <span style={{
                      fontFamily: 'system-ui, sans-serif',
                      fontSize: '14px',
                      color: colors.text.secondary,
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </Stack>

              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
                marginBottom: spacing.md,
              }}>
                Pay only for the pages you generate.
              </p>

              <Link href="/signup">
                <Button fullWidth size="md">
                  Start Generating
                </Button>
              </Link>
            </Card>
          </Grid>

          {/* Typical Report Costs */}
          <Card style={{ padding: spacing.xl, marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.lg,
              textAlign: 'center',
            }}>
              Typical Report Costs
            </h2>
            <div style={{ maxWidth: '42rem', margin: '0 auto', overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', fontFamily: 'system-ui, sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <th style={{
                      textAlign: 'left',
                      padding: `${spacing.sm} ${spacing.md}`,
                      color: colors.text.primary,
                      fontWeight: '600',
                    }}>
                      Report Type
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: `${spacing.sm} ${spacing.md}`,
                      color: colors.text.primary,
                      fontWeight: '600',
                    }}>
                      Typical Length
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: `${spacing.sm} ${spacing.md}`,
                      color: colors.text.primary,
                      fontWeight: '600',
                    }}>
                      Estimated Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${colors.border}33` }}>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary }}>SWEP Report</td>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary }}>10–20 Pages</td>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary, fontWeight: '600' }}>₦3,000 – ₦6,000</td>
                  </tr>
                  <tr>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary }}>SIWES Report</td>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary }}>20–40 Pages</td>
                    <td style={{ padding: `${spacing.sm} ${spacing.md}`, color: colors.text.secondary, fontWeight: '600' }}>₦6,000 – ₦12,000</td>
                  </tr>
                </tbody>
              </table>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '12px',
                color: colors.text.secondary,
                marginTop: spacing.md,
                textAlign: 'center',
              }}>
                Actual costs depend on the final number of pages generated.
              </p>
            </div>
          </Card>

          {/* Why Pay Per Page */}
          <Card style={{ padding: spacing.xl, marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.lg,
              textAlign: 'center',
            }}>
              Why Pay Per Page?
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: colors.text.secondary,
              textAlign: 'center',
              maxWidth: '768px',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}>
              Most students only need to generate one report. Vemiq's pricing is designed to be simple:
            </p>
            <Stack spacing="sm" style={{ maxWidth: '42rem', margin: '0 auto' }}>
              {[
                'Document your activities for free',
                'Generate only the pages you need',
                'Pay once',
                'Download your report',
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${colors.primary}1A`,
                  }}>
                    <div style={{ color: colors.primary }}>
                      <VemiqIcon category="status" name="completed" size={12} />
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    color: colors.text.secondary,
                  }}>
                    {item}
                  </span>
                </div>
              ))}
            </Stack>
            <div style={{ marginTop: spacing.lg, textAlign: 'center' }}>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                color: colors.text.secondary,
              }}>
                No recurring charges. No hidden fees. No long-term commitment.
              </p>
            </div>
          </Card>

          {/* What Happens After Payment */}
          <Card style={{ padding: spacing.xl, marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.lg,
              textAlign: 'center',
            }}>
              What Happens After Payment?
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '16px',
              color: colors.text.secondary,
              textAlign: 'center',
              maxWidth: '768px',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}>
              Once payment is completed, you can:
            </p>
            <Grid columns={3} gap="md" style={{ maxWidth: '64rem', margin: '0 auto' }}>
              {[
                { iconKey: 'download', category: 'action' as const, text: 'Export your report as a PDF' },
                { iconKey: 'report', category: 'data' as const, text: 'Access your generated report version' },
                { iconKey: 'edit', category: 'action' as const, text: 'Continue editing your report' },
                { iconKey: 'clock', category: 'data' as const, text: 'Download your report whenever needed' },
                { iconKey: 'settings', category: 'nav' as const, text: 'Keep your documentation stored in your account' },
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  backgroundColor: `${colors.background.surface}80`,
                  borderRadius: '12px',
                  border: `1px solid ${colors.border}`,
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${colors.primary}33`,
                  }}>
                    <div style={{ color: colors.primary }}>
                      <VemiqIcon category={item.category} name={item.iconKey} size={16} />
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    color: colors.text.primary,
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </Grid>
          </Card>

          {/* FAQ */}
          <Card style={{ padding: spacing.xl }}>
            <h3 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.lg,
              textAlign: 'center',
            }}>
              Frequently Asked Questions
            </h3>
            <Stack spacing="md" style={{ maxWidth: '768px', marginBottom: spacing.xl }}>
              {[
                {
                  q: 'Do I need to pay before using Vemiq?',
                  a: 'No. You can create an account, document your activities, upload evidence, and organize your records for free. Payment is only required when generating report pages and exporting your final report.',
                },
                {
                  q: 'Why does Vemiq charge per page?',
                  a: 'Industrial training reports vary in length. Charging per page ensures students only pay for the content they actually generate.',
                },
                {
                  q: 'Can I generate only part of my report?',
                  a: 'Yes. You can generate specific sections or pages and only pay for the content generated.',
                },
                {
                  q: 'What happens if I need to make edits later?',
                  a: 'Your report remains editable. You can update content and generate additional pages whenever needed.',
                },
                {
                  q: 'Are PDF exports included?',
                  a: 'Yes. PDF export is included for paid report generations.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept payments via Paystack, supporting debit cards, credit cards, and bank transfers.',
                },
              ].map((faq, index) => (
                <div key={faq.q} style={{
                  borderBottom: `1px solid ${colors.border}`,
                  paddingBottom: spacing.md,
                }}>
                  <h4 style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}>
                    {faq.q}
                  </h4>
                  <p style={{
                    fontFamily: 'system-ui, sans-serif',
                    fontSize: '14px',
                    color: colors.text.secondary,
                  }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </Stack>
          </Card>
        </Container>
      </div>
      <Footer />
    </main>
  );
}
