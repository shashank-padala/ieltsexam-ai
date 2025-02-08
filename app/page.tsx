import Navigation from '@/components/HeaderNavigation'
import HeroSection from '@/components/HeroSection'
import IELTSExamLibrary from '@/components/IELTSExamLibrary';


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      <IELTSExamLibrary />
    </div>
  )
}