import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import MockTests from '@/components/MockTests'
import PracticeModules from '@/components/PracticeModules'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      {/* <PracticeModules /> */}
      <MockTests />
    </div>
  )
}