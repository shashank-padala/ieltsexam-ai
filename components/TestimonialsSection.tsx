// components/TestimonialsSection.jsx
export default function TestimonialsSection() {
  return (
    <section className="bg-white text-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-10">What Our Users Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="p-6 bg-gray-100 rounded-lg">
            <p className="italic mb-4">
              “The AI feedback helped me go from a 6.5 to a 7.5 in writing! Highly recommend this
              platform for quick and detailed corrections.”
            </p>
            <h4 className="font-semibold">Aman K.</h4>
            <span className="text-sm text-gray-500">Band Score: 7.5</span>
          </div>

          {/* Testimonial 2 */}
          <div className="p-6 bg-gray-100 rounded-lg">
            <p className="italic mb-4">
              “I love how quickly I get corrections and vocabulary suggestions. It feels like having
              a personal tutor available 24/7.”
            </p>
            <h4 className="font-semibold">Sara M.</h4>
            <span className="text-sm text-gray-500">Band Score: 7.0</span>
          </div>

          {/* Testimonial 3 */}
          <div className="p-6 bg-gray-100 rounded-lg">
            <p className="italic mb-4">
              “The AI-based writing feedback helped me pinpoint grammar errors I didn't even realize
              I was making!”
            </p>
            <h4 className="font-semibold">Michael T.</h4>
            <span className="text-sm text-gray-500">Band Score: 7.5</span>
          </div>
        </div>
      </div>
    </section>
  )
}
