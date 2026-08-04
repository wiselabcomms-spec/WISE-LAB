import { MotionConfig } from 'framer-motion'
import { TrackProvider } from '@/lib/useTrackState'
import { BlogSectionsProvider } from '@/lib/blog/useSectionPosts'
import { SmoothScroll } from '@/components/SmoothScroll'
import { Nav } from '@/components/Nav'
import { CohortAnnouncementBar } from '@/components/CohortAnnouncementBar'
import { PMBanner } from '@/components/PMBanner'
import { Hero } from '@/sections/Hero'
import { WiseJourney } from '@/sections/WiseJourney'
import { BuildTracks } from '@/sections/BuildTracks'
import { EnterTheLab } from '@/sections/EnterTheLab'
import { Testimonials } from '@/sections/Testimonials'
import { PowerCircle } from '@/sections/PowerCircle'
import { BehindTheWings } from '@/sections/BehindTheWings'
import { BecomeAMentor } from '@/sections/BecomeAMentor'
import { WiseConnect } from '@/sections/WiseConnect'
import { WiseReports } from '@/sections/WiseReports'
import { Newsletter } from '@/sections/Newsletter'
import { Footer } from '@/sections/Footer'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <TrackProvider>
        <BlogSectionsProvider>
          <SmoothScroll>
            <Nav />
            <CohortAnnouncementBar />
            <PMBanner />
            <main>
              <Hero />
              <WiseJourney />
              <BuildTracks />
              <EnterTheLab />
              <Testimonials />
              <PowerCircle />
              <BehindTheWings />
              <BecomeAMentor />
              <WiseConnect />
              <WiseReports />
              <Newsletter />
            </main>
            <Footer />
          </SmoothScroll>
        </BlogSectionsProvider>
      </TrackProvider>
    </MotionConfig>
  )
}

export default App
