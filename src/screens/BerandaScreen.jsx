import { useState } from 'react';
import { PageWrapper, TopBar } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { useStreak } from '../hooks/useStreak';
import { useProfile } from '../hooks/useProfile';
import StoriesBar from '../components/beranda/StoriesBar';
import CarouselBanner from '../components/beranda/CarouselBanner';
import ReelsSection from '../components/beranda/ReelsSection';
import FeedCard from '../components/beranda/FeedCard';
import feedContent from '../data/feed-content.json';

export default function BerandaScreen() {
  const { user, signOut } = useAuth();
  const { progress } = useProgress(user?.id);
  const { streak } = useStreak(user?.id);
  const { profile } = useProfile(user?.id);

  return (
    <PageWrapper bottomNav>
      <TopBar 
        xp={streak?.total_xp || 0}
        userName={profile?.nama || user?.email?.split('@')[0] || 'Pelajar'}
        onLogout={signOut}
      />

      <div className="pb-24 overflow-y-auto">
        <StoriesBar progress={progress} />
        
        <CarouselBanner />
        
        <ReelsSection />

        <div className="px-4 mt-4 pb-4">
          <h2 className="font-serif font-black text-sm text-ink mb-4" style={{ padding: '8px' }}>Feed Belajar</h2>
          <div className="flex flex-col gap-3">
            {feedContent.map(item => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
