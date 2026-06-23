'use client';

import Link from 'next/link';
import { VemiqIcon } from '@/components/VemiqIcon';
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Container, Stack, Grid } from '@/design-system/layouts';
import { colors, spacing } from '@/design-system/tokens/index';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function Home() {

  return (
    <main style={{ minHeight: '100vh', backgroundColor: colors.background.base, margin: 0, padding: 0 }}>
      <Navbar />
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: `${spacing.xl} ${spacing.md} ${spacing.xl} ${spacing.md}`,
        paddingTop: spacing['3xl'],
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '160px',
            height: '160px',
            backgroundColor: `${colors.background.surface}80`,
            borderRadius: '50%',
            filter: 'blur(48px)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '160px',
            height: '160px',
            backgroundColor: `${colors.background.surface}80`,
            borderRadius: '50%',
            filter: 'blur(48px)',
          }} />
        </div>

        <div style={{ position: 'relative' }}>
          <Container size="lg">
            <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
              <h1 style={{
                fontFamily: plusJakartaSans.style.fontFamily,
                fontSize: '48px',
                fontWeight: '700',
                color: colors.text.primary,
                marginBottom: spacing.md,
                lineHeight: '1.2',
              }}>
                <span style={{ whiteSpace: 'nowrap' }}>Document Your SIWES</span><br />
                <span style={{ color: colors.primary, fontSize: '40px', display: 'block', marginTop: 0 }}>Generate Your Report</span>
              </h1>
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '16px',
                color: colors.text.primary,
                maxWidth: '768px',
                margin: '0 auto',
                marginBottom: spacing.lg,
                lineHeight: '1.6',
              }}>
                Vemiq helps students capture activities, store evidence, and organize training records throughout their industrial attachment, making report writing a structured process instead of a last-minute rush.
              </p>
              <Stack direction="horizontal" spacing="md" style={{ justifyContent: 'center' }}>
                <Link href="/signup" style={{ textDecoration: 'none' }}>
                  <Button size="lg" fullWidth>
                    Start Documenting
                  </Button>
                </Link>
                <Link href="/features" style={{ textDecoration: 'none' }}>
                  <Button size="lg" variant="ghost">
                    How It Works
                  </Button>
                </Link>
              </Stack>

              {/* Trust Indicators */}
              <Stack direction="horizontal" spacing="lg" style={{ justifyContent: 'center', marginTop: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{ color: colors.primary }}>
                    <VemiqIcon category="status" name="success" size={14} />
                  </div>
                  <span style={{ fontSize: '14px', color: colors.text.secondary }}>Built for SWEP & SIWES Students</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{ color: colors.primary }}>
                    <VemiqIcon category="status" name="success" size={14} />
                  </div>
                  <span style={{ fontSize: '14px', color: colors.text.secondary }}>Keep Activities, Photos & Records in One Place</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{ color: colors.primary }}>
                    <VemiqIcon category="status" name="success" size={14} />
                  </div>
                  <span style={{ fontSize: '14px', color: colors.text.secondary }}>Generate Institution-Ready Reports</span>
                </div>
              </Stack>
            </div>
          </Container>
        </div>
      </section>

      {/* Problem Section */}
      <section style={{
        padding: `${spacing.xl} ${spacing.md}`,
        backgroundColor: colors.background.surface,
      }}>
        <Container size="lg">
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '32px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
              The Problem Students Face
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              color: colors.text.secondary,
              maxWidth: '512px',
              margin: '0 auto',
            }}>
              Industrial training reports shouldn't be a source of stress
            </p>
          </div>
          <Grid columns={4} gap="md">
            {[
              { iconKey: 'file', title: 'Poor Formatting', desc: 'Students struggle with proper academic formatting standards', color: colors.danger },
              { iconKey: 'activity', title: 'Last-Minute Stress', desc: 'Procrastination leads to rushed, low-quality submissions', color: colors.warning },
              { iconKey: 'error', title: 'Rejected Reports', desc: 'Supervisors reject poorly formatted submissions', color: colors.danger },
              { iconKey: 'sparkles', title: 'Copying Old Projects', desc: 'Students copy from seniors instead of creating original work', color: colors.warning },
            ].map((item, index) => (
              <Card key={item.title} style={{ padding: spacing.lg }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: `${item.color}33`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md,
                }}>
                  <div style={{ color: item.color }}>
                    <VemiqIcon category="content" name={item.iconKey} size={24} />
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                  lineHeight: '1.6',
                }}>
                  {item.desc}
                </p>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Solution Section */}
      <section style={{
        padding: `${spacing.xl} ${spacing.md}`,
        backgroundColor: colors.background.surface,
      }}>
        <Container size="lg">
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '32px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}>
              How Vemiq Solves This
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              color: colors.text.secondary,
              maxWidth: '512px',
              margin: '0 auto',
            }}>
              Everything you need to create professional academic reports
            </p>
          </div>
          <Grid columns={3} gap="md">
            {[
              { title: 'AI-Assisted Writing', desc: 'Transform your weekly logs into professional academic content', iconKey: 'sparkles' },
              { title: 'Smart Formatting', desc: 'Automatic Times New Roman, 12pt, 1.5 spacing, proper margins', iconKey: 'file' },
              { title: 'Real-Time Preview', desc: 'See exactly how your report will look as you write', iconKey: 'shield' },
              { title: 'PDF Export', desc: 'Download print-ready PDFs with one click', iconKey: 'activity' },
              { title: 'Weekly Logbook', desc: 'Track activities with images and notes throughout your training', iconKey: 'success' },
              { title: 'Institution Ready', desc: 'Reports formatted to meet university standards', iconKey: 'star' },
            ].map((item, index) => (
              <Card key={item.title} style={{ padding: spacing.lg }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: `${colors.primary}33`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md,
                }}>
                  <div style={{ color: colors.primary }}>
                    <VemiqIcon category="status" name={item.iconKey} size={20} />
                  </div>
                </div>
                <h3 style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: colors.text.primary,
                  marginBottom: spacing.sm,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  color: colors.text.secondary,
                  lineHeight: '1.6',
                }}>
                  {item.desc}
                </p>
              </Card>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: `${spacing.xl} ${spacing.md}`,
        backgroundColor: colors.background.surface,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            backgroundColor: `${colors.background.surface}80`,
            borderRadius: '50%',
            filter: 'blur(32px)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '120px',
            height: '120px',
            backgroundColor: `${colors.background.surface}80`,
            borderRadius: '50%',
            filter: 'blur(32px)',
          }} />
        </div>
        <Container size="lg">
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <h2 style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '32px',
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing.lg,
            }}>
              Ready to Transform Your Industrial Training Experience?
            </h2>
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '18px',
              color: colors.text.secondary,
              marginBottom: spacing.xl,
              lineHeight: '1.6',
            }}>
              Join thousands of engineering students who are already using Vemiq
              to create professional reports in minutes.
            </p>
            <Stack direction="horizontal" spacing="md" style={{ justifyContent: 'center' }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <Button size="lg" variant="ghost">
                  View Pricing
                </Button>
              </Link>
            </Stack>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}
