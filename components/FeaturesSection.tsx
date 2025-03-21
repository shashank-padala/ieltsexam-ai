// FeaturesSection.jsx

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg">
            {/* Icon (replace with your own) */}
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-teal-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25c4.556 0 8.25-3.694 8.25-8.25S16.556 3.75 12 
                    3.75 3.75 7.444 3.75 12 7.444 20.25 12 20.25z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 12l1.5 1.5L15.75 7.5"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
            <p className="text-gray-300">
              Get instant, detailed feedback on your IELTS writing tasks, powered by cutting-edge AI.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-teal-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Band Score Predictions</h3>
            <p className="text-gray-300">
              Understand your projected Band Score so you know where you stand and how to improve.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-teal-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 5.25l1.5 1.5-1.5 1.5"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Grammar & Vocabulary Insights</h3>
            <p className="text-gray-300">
              Receive corrections and suggestions to refine your grammar and expand your vocabulary.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center p-6 bg-gray-800 rounded-lg">
            <div className="mb-4">
              <svg
                className="w-12 h-12 text-teal-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75h4.5m-4.5 3h4.5m-8.25 
                    3h11.25M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 
                    4.03-9 9 4.03 9 9 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Study Plans</h3>
            <p className="text-gray-300">
              Based on your performance, get study recommendations tailored to your specific needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
