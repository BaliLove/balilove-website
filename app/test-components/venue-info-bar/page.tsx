'use client'

import VenueInfoBar from '@/app/components/VenueInfoBar'

export default function Page() {
  const handleSave = () => console.log('Saved')
  const handleShare = () => console.log('Shared')

  return (
    <div>
      <h1 className="text-center text-2xl py-4">VenueInfoBar Test</h1>
      <VenueInfoBar
        name="Villa Vedas"
        rating={4.9}
        reviewCount={125}
        area="Tabanan"
        capacity={300}
        venueType="Villa"
        onSave={handleSave}
        onShare={handleShare}
      />
    </div>
  )
}
