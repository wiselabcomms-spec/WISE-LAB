import { MotionConfig } from 'framer-motion'
import { TrackProvider } from '@/lib/useTrackState'
import { HappeningsSectionsProvider } from '@/lib/happenings/useSectionPosts'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Nav } from '@/components/Nav'
import { CohortAnnouncementBar } from '@/components/CohortAnnouncementBar'
import { PMBanner } from '@/components/PMBanner'
import { CohortPopup } from '@/components/CohortPopup'
import { Hero } from '@/sections/Hero'
import { WiseJourney } from '@/sections/WiseJourney'
import { BuildTracks } from '@/sections/BuildTracks'
import { EnterTheLab } from '@/sections/EnterTheLab'
//import { Testimonials } from '@/sections/Testimonials'
import { PowerCircle } from '@/sections/PowerCircle'
import { BehindTheWings } from '@/sections/BehindTheWings'
import { BecomeAMentor } from '@/sections/BecomeAMentor'
import { WiseConnect } from '@/sections/WiseConnect'
//import { WiseReports } from '@/sections/WiseReports'
import { Newsletter } from '@/sections/Newsletter'
import { GlobalHappenings } from '@/sections/GlobalHappenings'
import { FAQSection } from '@/sections/FAQSection'
import { Footer } from '@/sections/Footer'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TrackProvider>
        <HappeningsSectionsProvider>
          <SmoothScroll>
            <div className="sticky top-0 z-50">
              <Nav />
              <CohortAnnouncementBar />
            </div>
            <PMBanner />
            <CohortPopup />
            <main>
              <Hero />
              <WiseJourney />
              <BuildTracks />
              <EnterTheLab />
              {/* <Testimonials /> */}
              <PowerCircle />
              <BehindTheWings />
              <BecomeAMentor />
              <WiseConnect />
              {/* <WiseReports /> */}
              <GlobalHappenings />
              <FAQSection />
              <Newsletter />
            </main>
            <Footer />
          </SmoothScroll>
        </HappeningsSectionsProvider>
      </TrackProvider>
    </MotionConfig>
  )
}

export default App
