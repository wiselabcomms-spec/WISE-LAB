import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
import { breadcrumbSchema, courseSchema } from '@/lib/structuredData'

const DESCRIPTION =
  'A structured six-month incubation programme for women-led, technology-enabled startups ready to validate, strengthen, launch, or scale.'

export function FounderFlightpathPage() {
  const { t } = useTranslation()
  useDocumentMeta({
    title: 'Founder Flightpath',
    description: DESCRIPTION,
    path: '/founder-flightpath',
    structuredData: [
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Founder Flightpath', path: '/founder-flightpath' },
      ]),
      courseSchema({ name: 'Founder Flightpath', description: DESCRIPTION, path: '/founder-flightpath' }),
    ],
  })
  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 pb-32 md:py-24 md:pb-32">
      <div className="grain" />
      <div className="container-wise relative max-w-3xl">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('founderFlightpathPage.back', 'Back to WISE Lab')}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10">
            <p className="eyebrow" style={{ color: '#2E7D7B' }}>
              {t('founderFlightpathPage.kicker', 'Track One · Women-Led Startup Incubation')}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-plum">
              {t('founderFlightpathPage.title', 'Founder Flightpath')}
            </h1>
            <p className="mt-3 font-display text-xl italic text-plum/70">
              {t('founderFlightpathPage.subtitle', 'From an Early Idea to an Investment-Ready Enterprise')}
            </p>

            <div className="prose prose-plum mt-8 max-w-none space-y-6 text-[17px] leading-relaxed text-plum/80">
              <p>
                {t(
                  'founderFlightpathPage.intro1',
                  'The WISE Lab Incubation Track is a structured six-month programme for women-led, technology-enabled startups seeking to validate, strengthen, launch, or scale their ventures.'
                )}
              </p>
              <p>
                {t(
                  'founderFlightpathPage.intro2',
                  'The programme is designed for founders with an innovative idea, minimum viable product, early-stage startup, or an existing venture ready for accelerated growth.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('founderFlightpathPage.scale.title', 'Programme Scale')}
              </h2>
              <p>{t('founderFlightpathPage.scale.intro', 'Over the five-year project period, WISE Lab will operate recurring incubation cohorts with the mandate to support:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.scale.li1', '20 successful startup graduates annually')}</li>
                <li>{t('founderFlightpathPage.scale.li2', 'Approximately 100 women-led startup graduates over five years')}</li>
                <li>{t('founderFlightpathPage.scale.li3', 'Startups operating in technology and technology-enabled sectors')}</li>
                <li>{t('founderFlightpathPage.scale.li4', 'Founders from Islamabad and across Pakistan, including eligible diaspora-led ventures where applicable')}</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('founderFlightpathPage.receive.title', 'What Selected Startups Will Receive')}
              </h2>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.incubation.title', 'Structured Incubation')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.incubation.body',
                  'A focused six-month growth journey covering business modelling, product validation, customer discovery, operations, revenue planning, branding, financial management, governance, and scale strategy.'
                )}
              </p>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.mentorship.title', 'Real-Time Mentorship')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.mentorship.body1',
                  'Direct access to experienced founders, sector specialists, technology experts, business leaders, investors, legal advisers, financial professionals, and ecosystem practitioners.'
                )}
              </p>
              <p>
                {t(
                  'founderFlightpathPage.receive.mentorship.body2',
                  "Mentorship will be aligned with each startup's stage, sector, challenges, and growth objectives rather than delivered as generic classroom instruction."
                )}
              </p>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.investment.title', 'Investment Readiness')}
              </h3>
              <p>{t('founderFlightpathPage.receive.investment.intro', 'Support in developing:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.receive.investment.li1', 'Investor-ready pitch decks')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li2', 'Financial projections and valuation fundamentals')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li3', 'Business and revenue models')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li4', 'Data rooms and due-diligence documentation')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li5', 'Investment narratives')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li6', 'Funding strategies')}</li>
                <li>{t('founderFlightpathPage.receive.investment.li7', 'Negotiation and pitching skills')}</li>
              </ul>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.summits.title', 'Investor Summits and Demo Days')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.summits.body1',
                  'Graduating startups will receive opportunities to present their businesses through WISE Lab investor summits, demo days, startup showcases, and curated pitching sessions.'
                )}
              </p>
              <p>{t('founderFlightpathPage.receive.summits.intro', 'These platforms will bring together:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.receive.summits.li1', 'Angel investors')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li2', 'Venture capital firms')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li3', 'Corporate innovation teams')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li4', 'Banks and financial institutions')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li5', 'Development-sector funders')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li6', 'Government stakeholders')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li7', 'Diaspora investors')}</li>
                <li>{t('founderFlightpathPage.receive.summits.li8', 'Industry leaders and strategic partners')}</li>
              </ul>
              <p>
                {t(
                  'founderFlightpathPage.receive.summits.body2',
                  'The objective is to help startups attract investment, secure strategic partnerships, identify pilot opportunities, and strengthen their market credibility.'
                )}
              </p>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.grant.title', 'Startup Grant Opportunity')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.grant.body1',
                  'Under the approved programme framework, selected high-performing graduates may become eligible for startup grant support.'
                )}
              </p>
              <p>{t('founderFlightpathPage.receive.grant.intro', 'Subject to confirmation from the final RFP and approved grant mechanism:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.receive.grant.li1', 'Up to five startups from the eligible graduating cohort may receive a grant of PKR 2 million each.')}</li>
                <li>{t('founderFlightpathPage.receive.grant.li2', 'Grant selection may be based on performance, innovation potential, commercial viability, programme participation, investment readiness, and evaluation by the designated selection committee.')}</li>
                <li>{t('founderFlightpathPage.receive.grant.li3', 'Graduation from the incubation programme will not automatically guarantee grant funding.')}</li>
              </ul>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.market.title', 'Market Access')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.market.body',
                  'Startups will be connected with relevant corporations, distribution networks, universities, government institutions, industry associations, digital platforms, and commercial partners.'
                )}
              </p>
              <p>{t('founderFlightpathPage.receive.market.intro', 'Market-access support may include:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.receive.market.li1', 'Business-to-business introductions')}</li>
                <li>{t('founderFlightpathPage.receive.market.li2', 'Corporate pilot opportunities')}</li>
                <li>{t('founderFlightpathPage.receive.market.li3', 'Product showcases')}</li>
                <li>{t('founderFlightpathPage.receive.market.li4', 'Partnership matchmaking')}</li>
                <li>{t('founderFlightpathPage.receive.market.li5', 'Procurement-readiness support')}</li>
                <li>{t('founderFlightpathPage.receive.market.li6', 'Customer discovery opportunities')}</li>
                <li>{t('founderFlightpathPage.receive.market.li7', 'Access to national and regional events')}</li>
                <li>{t('founderFlightpathPage.receive.market.li8', "Visibility through WISE Lab's communication and media platforms")}</li>
              </ul>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.tech.title', 'Technology and Digital Enablement')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.tech.body',
                  'Participants will receive support in strengthening their digital products, technology adoption, online visibility, data use, cybersecurity awareness, digital marketing, and platform-based growth.'
                )}
              </p>

              <h3 className="font-display text-lg font-semibold text-plum">
                {t('founderFlightpathPage.receive.ecosystem.title', 'Ecosystem Exposure')}
              </h3>
              <p>
                {t(
                  'founderFlightpathPage.receive.ecosystem.body',
                  'Founders will become part of a wider entrepreneurial community supported by MoITT, Ignite, Jazz, Mobilink Bank, Change Mechanics, universities, industry leaders, development partners, mentors, and investors.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('founderFlightpathPage.who.title', 'Who Should Apply?')}
              </h2>
              <p>{t('founderFlightpathPage.who.intro', 'The Incubation Track is suited to women who:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-teal">
                <li>{t('founderFlightpathPage.who.li1', 'Have an innovative or technology-enabled business idea')}</li>
                <li>{t('founderFlightpathPage.who.li2', 'Are developing an MVP or prototype')}</li>
                <li>{t('founderFlightpathPage.who.li3', 'Have launched an early-stage startup')}</li>
                <li>{t('founderFlightpathPage.who.li4', 'Are generating early revenue and want to scale')}</li>
                <li>{t('founderFlightpathPage.who.li5', 'Need structured mentorship and business support')}</li>
                <li>{t('founderFlightpathPage.who.li6', 'Are seeking investment or strategic partnerships')}</li>
                <li>{t('founderFlightpathPage.who.li7', 'Want access to corporate, investor, government, and market networks')}</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('founderFlightpathPage.outcome.title', 'The Outcome')}
              </h2>
              <p>
                {t(
                  'founderFlightpathPage.outcome.body',
                  'By graduation, participating startups should have a clearer business model, stronger market validation, improved financial and operational systems, greater investment readiness, and a practical pathway towards revenue growth and scale.'
                )}
              </p>

              <blockquote className="border-l-2 border-teal pl-6 font-display text-xl font-medium italic text-plum">
                {t('founderFlightpathPage.closingLine', 'Pakistan’s next big founder may not look like a founder—yet.')}
              </blockquote>
            </div>

            <Link
              to="/apply/founder"
              className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ background: '#0F3D3B' }}
            >
              {t('founderFlightpathPage.apply', 'Apply to Founder Flightpath')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </Reveal>
      </div>
    </main>
  )
}
