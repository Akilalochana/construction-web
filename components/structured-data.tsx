import Script from 'next/script';

export default function StructuredData() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sri Ranjana Construction",
    "description": "Professional construction company offering turnkey building services, home construction, renovations, and project completion with 15+ years of experience.",
    "url": "https://your-domain.com", // Replace with actual domain
    "logo": "https://your-domain.com/assets/logo.png", // Replace with actual logo URL
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-XXXXXXXXXX", // Replace with actual phone
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address", // Replace with actual address
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your PIN Code",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://facebook.com/your-page", // Replace with actual social media
      "https://instagram.com/your-handle",
      "https://linkedin.com/company/your-company"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Construction Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Turnkey Construction",
            "description": "Complete construction solutions from planning to handover"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Home Renovation",
            "description": "Expert renovation and remodeling services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Project Completion",
            "description": "Complete unfinished construction projects"
          }
        }
      ]
    }
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://your-domain.com/#organization",
    "name": "Sri Ranjana Construction",
    "image": "https://your-domain.com/assets/hero.jpg",
    "description": "Professional construction company specializing in turnkey building services, home construction, and renovations.",
    "url": "https://your-domain.com",
    "telephone": "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your PIN Code",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "XX.XXXXXX", // Replace with actual coordinates
      "longitude": "XX.XXXXXX"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "priceRange": "$$"
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <Script
        id="local-business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData),
        }}
      />
    </>
  );
}