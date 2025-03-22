// FeaturesSection.jsx

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
          Key Features
        </h2>
        {/* Feature 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-12">
          {/* Text: 1/3 width */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              AI-Powered Feedback
            </h3>
            <p className="text-gray-600">
              Get instant, detailed feedback on your IELTS writing tasks,
              powered by cutting-edge AI. Identify errors, receive suggestions
              to refine your writing, and watch your skills improve rapidly.
            </p>
          </div>
          {/* Image: 2/3 width */}
          <div className="md:col-span-2">
            <img
              src="/response_comparison.PNG"
              alt="Response Comparison"
              className="w-full h-auto rounded shadow"
            />
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Text: 1/3 width */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Band Score Predictions
            </h3>
            <p className="text-gray-600">
              Understand your projected Band Score so you know where you stand
              and how to improve. Our AI estimates your performance based on
              official IELTS criteria, giving you a clear roadmap to success.
            </p>
          </div>
          {/* Image: 2/3 width */}
          <div className="md:col-span-2">
            <img
              src="/writing_eval.PNG"
              alt="Writing Module Evaluation"
              className="w-full h-auto rounded shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
