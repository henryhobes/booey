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
    id: "karen-t",
    quote:
      "I used the recipe helper to plan a whole week of dinners. It asked what I had in my fridge and gave me meals my family actually loved.",
    name: "Karen T.",
    age: 54,
    occupation: "Office Manager",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    rating: 5,
  },
  {
    id: "robert-j",
    quote:
      "I needed to write a tricky email to my landlord. Booey asked me a few questions and drafted something better than I could have written myself.",
    name: "Robert J.",
    age: 59,
    occupation: "Retired Teacher",
    photoUrl: "https://i.pravatar.cc/300?img=68",
    rating: 5,
  },
  {
    id: "maria-l",
    quote:
      "The budget planner helped me figure out where my money was going. Simple questions, clear answers. I wish everything online was this easy.",
    name: "Maria L.",
    age: 47,
    occupation: "Healthcare Administrator",
    photoUrl: "https://i.pravatar.cc/300?img=47",
    rating: 5,
  },
];
