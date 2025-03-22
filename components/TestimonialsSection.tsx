// components/TestimonialsSection.jsx

export default function TestimonialsSection() {
  return (
    // Subtle gradient background
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 text-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          What Our Users Say
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Testimonial 1 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-lg italic text-gray-700 mb-4">
              “The AI feedback helped me go from a 6.5 to a 7.5 in writing! Highly recommend this
              platform for quick and detailed corrections.”
            </p>
            <h4 className="font-semibold text-gray-900">Aman K.</h4>
            <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              Band Score: 7.5
            </span>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-lg italic text-gray-700 mb-4">
              “I love how quickly I get corrections and vocabulary suggestions. It feels like having
              a personal tutor available 24/7.”
            </p>
            <h4 className="font-semibold text-gray-900">Sara M.</h4>
            <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              Band Score: 7.0
            </span>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-white rounded-lg shadow">
            <p className="text-lg italic text-gray-700 mb-4">
              “The AI-based writing feedback helped me pinpoint grammar errors I didn't even realize
              I was making!”
            </p>
            <h4 className="font-semibold text-gray-900">Michael T.</h4>
            <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              Band Score: 7.5
            </span>
          </div>

        </div>
      </div>
    </section>
  )
}
