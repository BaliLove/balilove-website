// Shared sample data for component testing
export const sampleVenue = {
  name: "Villa Vedas",
  area: "tabanan",
  location: {
    address: "Jl. Villa Vedas, Tabanan, Bali",
    coordinates: { lat: -8.5, lng: 115.1 }
  }
};

export const sampleTeamMembers = [
  {
    _id: "1",
    name: "Talitha Smith",
    jobRole: "Senior Wedding Planner",
    profileImage: null,
    bio: "Expert wedding planner with 10+ years experience",
    teamOrder: 1
  },
  {
    _id: "2", 
    name: "Sarah Johnson",
    jobRole: "Wedding Coordinator", 
    profileImage: null,
    bio: "Detailed coordinator ensuring perfect execution",
    teamOrder: 2
  }
];

export const sampleRealWeddings = [
  {
    _id: "1",
    title: "Sarah & Tom",
    brideName: "Sarah",
    groomName: "Tom", 
    weddingDate: "2024-06-15",
    guestCount: 120,
    heroImage: {
      asset: { url: "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=400&h=400&fit=crop" },
      alt: "Sarah & Tom Wedding"
    },
    gallery: [
      {
        image: { asset: { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=400&fit=crop" } },
        alt: "Reception"
      }
    ],
    highlightQuote: "Villa Vedas provided the perfect setting for our dream wedding. The ocean views were breathtaking!",
    slug: { current: "sarah-tom-villa-vedas" }
  },
  {
    _id: "2",
    title: "Emma & James",
    brideName: "Emma",
    groomName: "James",
    weddingDate: "2024-07-20", 
    guestCount: 80,
    heroImage: {
      asset: { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop" },
      alt: "Emma & James Wedding"
    },
    gallery: [],
    highlightQuote: "An intimate celebration with close family and friends in paradise.",
    slug: { current: "emma-james-villa-vedas" }
  }
];

export const sampleGalleryImages = [
  { 
    asset: { url: "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=400&h=300&fit=crop" },
    alt: "Wedding ceremony"
  },
  {
    asset: { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop" },
    alt: "Reception setup"
  },
  {
    asset: { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop" },
    alt: "Couple portrait"
  }
];

export const sampleVenueGallery = [
  {
    image: {
      asset: {
        _id: "image-1",
        url: "https://images.unsplash.com/photo-1519167758481-83f29c1fe8ea?w=400&h=300&fit=crop"
      }
    },
    alt: "Wedding ceremony",
    caption: "Beautiful ceremony at Villa Vedas",
    category: "ceremony",
    featured: true,
    displayOrder: 1
  },
  {
    image: {
      asset: {
        _id: "image-2",
        url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop"
      }
    },
    alt: "Reception setup",
    caption: "Elegant reception setup",
    category: "reception",
    featured: false,
    displayOrder: 2
  }
];
