interface Offer {
  offerType: string;
  offerName: string;
  offerTagline: string;
  offerDetails: string;
  offerPercentage: string;
  offerImage: string;
  offerEndDate: string;
  accentColor: string;
  features: string[];
}

export const offer: Offer = {
  offerType: "Limited Time Deal",
  offerName: "Summer Sale 2025",
  offerTagline: "Hottest styles. Coolest prices.",
  offerDetails: "Get up to",
  offerPercentage: "50",
  offerImage:
    "https://i.postimg.cc/G2FT0xCn/fashion-portrait-two-smiling-brunette-women-models-summer-casual-hipster-overcoat-posing-gray-Photor.png",
  offerEndDate: "2026-05-31T23:59:59Z",
  accentColor: "#f59e0b",
  features: ["Free Shipping", "Easy Returns", "Exclusive Styles"],
};
// "https://i.postimg.cc/G2FT0xCn/fashion-portrait-two-smiling-brunette-women-models-summer-casual-hipster-overcoat-posing-gray-Photor.png",
