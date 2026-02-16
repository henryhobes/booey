import Image from "next/image";
import type { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5 mb-3"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "text-yellow-500" : "text-gray-300"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, name, age, occupation, photoUrl, rating } = testimonial;

  return (
    <figure
      className="bg-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col h-full"
      style={{ minHeight: "280px" }}
    >
      {/* Photo */}
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={photoUrl}
          alt={`Photo of ${name}`}
          width={80}
          height={80}
          className="rounded-full object-cover w-16 h-16 md:w-20 md:h-20"
          unoptimized // Using external placeholder images
        />
        <figcaption className="flex flex-col">
          <cite className="not-italic font-semibold text-lg text-primary">
            {name}
          </cite>
          <span className="text-base text-base-content">
            {age}, {occupation}
          </span>
        </figcaption>
      </div>

      {/* Rating */}
      {rating && <StarRating rating={rating} />}

      {/* Quote */}
      <blockquote className="flex-1 text-lg italic leading-relaxed text-base-content">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </figure>
  );
}
