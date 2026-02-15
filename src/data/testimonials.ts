export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  age: number;
  occupation: string;
  photoUrl: string;
  rating?: number; // 1-5 stars, optional
}

export const testimonials: Testimonial[] = [
  {
    id: "sarah-m",
    quote:
      "I was skeptical about AI, but Booey made it simple. No tech jargon, just helpful answers to real questions I had.",
    name: "Sarah M.",
    age: 52,
    occupation: "Small Business Owner",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    rating: 5,
  },
  {
    id: "robert-j",
    quote:
      "My daughter kept telling me to try AI tools, but they always felt too complicated. Booey is different — it just works.",
    name: "Robert J.",
    age: 58,
    occupation: "Retired Teacher",
    photoUrl: "https://i.pravatar.cc/300?img=68",
    rating: 5,
  },
  {
    id: "maria-l",
    quote:
      "I use Booey to help write emails and plan trips. It feels like having a smart friend who's always ready to help.",
    name: "Maria L.",
    age: 47,
    occupation: "Healthcare Administrator",
    photoUrl: "https://i.pravatar.cc/300?img=47",
    rating: 5,
  },
];
