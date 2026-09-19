import React, { useState } from 'react';
import { PlanRupeeProvider, usePlanRupee } from './context/PlanRupeeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PackagesOverview } from './components/PackagesOverview';
import { RoadmapSection } from './components/RoadmapSection';
import { LocalMarketplace } from './components/LocalMarketplace';
import { ConciergeSection } from './components/ConciergeSection';
import { DataLoopSection } from './components/DataLoopSection';
import { DiscoverSection } from './components/DiscoverSection';
import { PricingSection } from './components/PricingSection';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

// Modals
import { LocalProfileModal } from './components/LocalProfileModal';
import { PlaceDetailsModal } from './components/PlaceDetailsModal';
import { LocalBookingModal } from './components/LocalBookingModal';
import { ReviewSubmissionModal } from './components/ReviewSubmissionModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { BecomeLocalModal } from './components/BecomeLocalModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ConciergeTrackerModal } from './components/ConciergeTrackerModal';

const MainContent: React.FC = () => {
  const {
    selectedLocalForModal,
    setSelectedLocalForModal,
    selectedPlaceForModal,
    setSelectedPlaceForModal,
    isLocalBookingModalOpen,
    setIsLocalBookingModalOpen,
    activeLocalToBook,
    setActiveLocalToBook,
    isReviewModalOpen,
    setIsReviewModalOpen,
    activePlaceToReview,
    setActivePlaceToReview,
    isBecomeLocalModalOpen,
    setIsBecomeLocalModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    myConciergeRequests
  } = usePlanRupee();

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeTrackerReqId, setActiveTrackerReqId] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePackageSelect = (pkg: 'roadmap' | 'local' | 'concierge') => {
    if (pkg === 'roadmap') {
      scrollToSection('roadmap');
    } else if (pkg === 'local') {
      scrollToSection('locals');
    } else if (pkg === 'concierge') {
      scrollToSection('concierge');
    }
  };

  const trackedRequest = myConciergeRequests.find(r => r.id === activeTrackerReqId);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans selection:bg-neutral-950 selection:text-white">
      
      {/* Sticky White Navbar */}
      <Navbar 
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* Section 4 & 5: Hero & Trip Planner Form */}
        <Hero onPackageSelect={handlePackageSelect} />

        {/* Section 1: The Three PlanRupee Experiences Overview */}
        <PackagesOverview onSelectPackage={handlePackageSelect} />

        {/* Section 11 & 12: Interactive Day-by-Day Roadmap Generator */}
        <RoadmapSection />

        {/* Section 13 & 14: Meet Your Local Marketplace */}
        <LocalMarketplace />

        {/* Section 3 & 15: PlanRupee 5-Star Luxury Concierge */}
        <ConciergeSection />

        {/* Section 24: Discover Chandigarh, Patiala, Rajpura */}
        <DiscoverSection />


      </main>

      {/* Section 38: Minimalist Footer */}
      <Footer 
        onScrollToSection={scrollToSection}
        onOpenBecomeLocal={() => setIsBecomeLocalModalOpen(true)}
      />

      {/* MODAL 1: Deep Local Profile Modal (Section 14) */}
      {selectedLocalForModal && (
        <LocalProfileModal
          local={selectedLocalForModal}
          onClose={() => setSelectedLocalForModal(null)}
          onBookConsultation={(local) => {
            setSelectedLocalForModal(null);
            setActiveLocalToBook(local);
            setIsLocalBookingModalOpen(true);
          }}
        />
      )}

      {/* MODAL 2: 1-on-1 Local Consultation Booking Modal */}
      {isLocalBookingModalOpen && activeLocalToBook && (
        <LocalBookingModal
          local={activeLocalToBook}
          onClose={() => {
            setIsLocalBookingModalOpen(false);
            setActiveLocalToBook(null);
          }}
          onSuccess={() => {
            setIsLocalBookingModalOpen(false);
            setActiveLocalToBook(null);
            setIsDashboardOpen(true);
          }}
        />
      )}

      {/* MODAL 3: Place Details Modal (Section 18 & 22) */}
      {selectedPlaceForModal && (
        <PlaceDetailsModal
          place={selectedPlaceForModal}
          onClose={() => setSelectedPlaceForModal(null)}
          onOpenReview={(place) => {
            setSelectedPlaceForModal(null);
            setActivePlaceToReview(place);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* MODAL 4: Multi-Criteria Review Submission Modal (Section 19 & 20) */}
      {isReviewModalOpen && activePlaceToReview && (
        <ReviewSubmissionModal
          place={activePlaceToReview}
          onClose={() => {
            setIsReviewModalOpen(false);
            setActivePlaceToReview(null);
          }}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            setActivePlaceToReview(null);
          }}
        />
      )}

      {/* MODAL 5: Traveler Dashboard & Workspace (Section 26) */}
      {isDashboardOpen && (
        <UserDashboardModal
          onClose={() => setIsDashboardOpen(false)}
          onOpenRoadmap={() => {
            setIsDashboardOpen(false);
            scrollToSection('roadmap');
          }}
          onOpenConciergeTracker={(reqId) => {
            setIsDashboardOpen(false);
            setActiveTrackerReqId(reqId);
          }}
        />
      )}

      {/* MODAL 6: Become a Verified Local Application (Section 27) */}
      {isBecomeLocalModalOpen && (
        <BecomeLocalModal
          onClose={() => setIsBecomeLocalModalOpen(false)}
        />
      )}

      {/* MODAL 7: Admin Operations & Data Moderation Desk (Section 32) */}
      {isAdminModalOpen && (
        <AdminPanelModal
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* MODAL 8: Live Concierge Tracker Modal (Section 16) */}
      {activeTrackerReqId && trackedRequest && (
        <ConciergeTrackerModal
          request={trackedRequest}
          onClose={() => setActiveTrackerReqId(null)}
        />
      )}

    </div>
  );
};

export function App() {
  return (
    <PlanRupeeProvider>
      <MainContent />
    </PlanRupeeProvider>
  );
}

export default App;
