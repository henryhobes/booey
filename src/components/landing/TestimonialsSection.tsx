import { testimonials } from "@/data/testimonials";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialsSection() {
  return (
    <section
      className="py-12 md:py-16 lg:py-24"
      style={{ backgroundColor: "#FAF8F5" }}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2
          id="testimonials-heading"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-12"
          style={{ color: "#2D2D2D" }}
        >
          Real people, real results
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          role="list"
          aria-label="Customer testimonials"
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} role="listitem">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
