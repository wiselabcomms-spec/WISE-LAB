import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'

export function EnterpriseFlightpathPage() {
  const { t } = useTranslation()
  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 md:py-24">
      <div className="grain" />
      <div className="container-wise relative max-w-3xl">
        <Reveal>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {t('enterpriseFlightpathPage.back', 'Back to WISE Lab')}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <article className="mt-10">
            <p className="eyebrow" style={{ color: '#E8823C' }}>
              {t('enterpriseFlightpathPage.kicker', 'Track Two · Micro-Entrepreneurship and MSME Training')}
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold leading-[1.05] text-plum">
              {t('enterpriseFlightpathPage.title', 'Enterprise Flightpath')}
            </h1>
            <p className="mt-3 font-display text-xl italic text-plum/70">
              {t(
                'enterpriseFlightpathPage.subtitle',
                'Turning Skills, Home-Based Work and Small Businesses into Sustainable Enterprises'
              )}
            </p>

            <div className="prose prose-plum mt-8 max-w-none space-y-6 text-[17px] leading-relaxed text-plum/80">
              <p>
                {t(
                  'enterpriseFlightpathPage.intro1',
                  'The WISE Lab Micro-Entrepreneurship Training Track is a nationwide capacity-building programme designed for women running micro, small, home-based, informal, or early-stage businesses.'
                )}
              </p>
              <p>
                {t(
                  'enterpriseFlightpathPage.intro2',
                  'The track will help women strengthen their existing enterprises, adopt digital tools, formalise business practices, access financial services, and reach wider markets.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.scale.title', 'Programme Scale')}
              </h2>
              <p>{t('enterpriseFlightpathPage.scale.intro', 'Across the five-year project period, WISE Lab aims to train:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-coral">
                <li>{t('enterpriseFlightpathPage.scale.li1', '1,000 women entrepreneurs')}</li>
                <li>{t('enterpriseFlightpathPage.scale.li2', 'Approximately 200 women annually')}</li>
                <li>{t('enterpriseFlightpathPage.scale.li3', 'Participants from urban, rural, underserved, and geographically diverse communities across Pakistan')}</li>
              </ul>
              <p>
                {t(
                  'enterpriseFlightpathPage.scale.priority',
                  'Priority outreach may include women entrepreneurs from Balochistan, Gilgit-Baltistan, Azad Jammu and Kashmir, rural Sindh, Khyber Pakhtunkhwa, Punjab, and other underserved regions.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.learn.title', 'What Participants Will Learn')}
              </h2>
              <p>{t('enterpriseFlightpathPage.learn.intro', 'The programme may include practical training in:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-coral columns-1 sm:columns-2">
                <li>{t('enterpriseFlightpathPage.learn.li1', 'Business planning')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li2', 'Costing and pricing')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li3', 'Bookkeeping and cash-flow management')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li4', 'Customer identification')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li5', 'Branding and packaging')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li6', 'Digital marketing')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li7', 'Social-commerce selling')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li8', 'E-commerce and marketplace onboarding')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li9', 'Financial literacy')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li10', 'Digital payments')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li11', 'Access to banking and credit')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li12', 'Product development')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li13', 'Quality assurance')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li14', 'Business registration and formalisation')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li15', 'Sales and negotiation')}</li>
                <li>{t('enterpriseFlightpathPage.learn.li16', 'Market linkage and growth planning')}</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.who.title', 'Who Is This Track For?')}
              </h2>
              <p>{t('enterpriseFlightpathPage.who.intro', 'The Micro-Entrepreneurship Track is suitable for women working in areas such as:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-coral columns-1 sm:columns-2">
                <li>{t('enterpriseFlightpathPage.who.li1', 'Food and beverages')}</li>
                <li>{t('enterpriseFlightpathPage.who.li2', 'Fashion, apparel and textiles')}</li>
                <li>{t('enterpriseFlightpathPage.who.li3', 'Beauty and personal care')}</li>
                <li>{t('enterpriseFlightpathPage.who.li4', 'Handicrafts and creative products')}</li>
                <li>{t('enterpriseFlightpathPage.who.li5', 'Education and training')}</li>
                <li>{t('enterpriseFlightpathPage.who.li6', 'Agriculture and food processing')}</li>
                <li>{t('enterpriseFlightpathPage.who.li7', 'Retail and commerce')}</li>
                <li>{t('enterpriseFlightpathPage.who.li8', 'Home-based production')}</li>
                <li>{t('enterpriseFlightpathPage.who.li9', 'Digital and professional services')}</li>
                <li>{t('enterpriseFlightpathPage.who.li10', 'Community-based businesses')}</li>
                <li>{t('enterpriseFlightpathPage.who.li11', 'Other micro and small enterprises with growth potential')}</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.mentorship.title', 'Practical Mentorship and Advisory Support')}
              </h2>
              <p>
                {t(
                  'enterpriseFlightpathPage.mentorship.body1',
                  'Participants will gain access to trainers, business advisers, financial-literacy experts, digital specialists, industry practitioners, and relevant ecosystem partners.'
                )}
              </p>
              <p>
                {t(
                  'enterpriseFlightpathPage.mentorship.body2',
                  'Mentorship will focus on solving real business challenges, including pricing products, reaching customers, managing finances, improving packaging, setting up digital storefronts, and preparing for financing.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.financial.title', 'Financial Enablement')}
              </h2>
              <p>
                {t(
                  'enterpriseFlightpathPage.financial.intro',
                  "Through WISE Lab's consortium and financial-sector relationships, eligible participants may receive guidance on:"
                )}
              </p>
              <ul className="list-disc space-y-2 pl-5 marker:text-coral">
                <li>{t('enterpriseFlightpathPage.financial.li1', 'Business bank accounts')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li2', 'Digital wallets and payments')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li3', 'Credit-readiness')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li4', 'Microfinance products')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li5', 'Savings and financial planning')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li6', 'Documentation required for financing')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li7', 'Responsible borrowing')}</li>
                <li>{t('enterpriseFlightpathPage.financial.li8', 'Government or partner-supported funding opportunities')}</li>
              </ul>
              <p className="text-plum/60">
                {t(
                  'enterpriseFlightpathPage.financial.note',
                  'Eligible participants may be connected with relevant grants, financing facilities, microfinance products, digital banking solutions, or partner-supported opportunities, subject to applicable criteria and availability.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.market.title', 'Market and Buyer Linkages')}
              </h2>
              <p>{t('enterpriseFlightpathPage.market.intro', 'Participants may be connected with:')}</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-coral">
                <li>{t('enterpriseFlightpathPage.market.li1', 'Retailers and distributors')}</li>
                <li>{t('enterpriseFlightpathPage.market.li2', 'E-commerce platforms')}</li>
                <li>{t('enterpriseFlightpathPage.market.li3', 'Corporate procurement networks')}</li>
                <li>{t('enterpriseFlightpathPage.market.li4', 'Trade bodies and chambers')}</li>
                <li>{t('enterpriseFlightpathPage.market.li5', 'Exhibitions and product showcases')}</li>
                <li>{t('enterpriseFlightpathPage.market.li6', 'Export-development platforms')}</li>
                <li>{t('enterpriseFlightpathPage.market.li7', 'Digital marketplaces')}</li>
                <li>{t('enterpriseFlightpathPage.market.li8', 'Women-focused business networks')}</li>
                <li>{t('enterpriseFlightpathPage.market.li9', 'Financial institutions')}</li>
                <li>{t('enterpriseFlightpathPage.market.li10', 'Relevant government support programmes')}</li>
              </ul>
              <p>
                {t(
                  'enterpriseFlightpathPage.market.body',
                  'The objective is to help women move beyond one-time training and translate their learning into increased sales, improved visibility, better business systems, and wider customer access.'
                )}
              </p>

              <h2 className="font-display text-2xl font-bold text-plum">
                {t('enterpriseFlightpathPage.outcome.title', 'The Outcome')}
              </h2>
              <p>
                {t(
                  'enterpriseFlightpathPage.outcome.body',
                  'Participants should leave the programme with stronger financial understanding, improved business practices, increased digital capability, clearer growth plans, and better access to customers, finance, and markets.'
                )}
              </p>
            </div>

            <Link
              to="/apply/enterprise"
              className="mt-10 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ background: '#B85C1A' }}
            >
              {t('enterpriseFlightpathPage.apply', 'Register your interest')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </Reveal>
      </div>
    </main>
  )
}
