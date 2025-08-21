import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              ← Back to Joyoda
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Joyoda Smart ("Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 mb-4">
                Joyoda Smart is an AI-powered image editing platform that provides various tools for image manipulation,
                enhancement, and generation. Our services include but are not limited to background removal, style
                transfer, image upscaling, face enhancement, and other AI-driven image processing capabilities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of our Service, you must register for an account. You agree to provide
                accurate, current, and complete information during the registration process and to update such
                information to keep it accurate, current, and complete.
              </p>
              <p className="text-gray-700 mb-4">
                You are responsible for safeguarding the password and for all activities that occur under your account.
                You agree not to disclose your password to any third party.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  Upload, process, or generate content that is illegal, harmful, threatening, abusive, defamatory, or
                  otherwise objectionable
                </li>
                <li>Violate any intellectual property rights of others</li>
                <li>Create deepfakes or manipulated content intended to deceive or harm others</li>
                <li>Process images of individuals without proper consent</li>
                <li>Attempt to reverse engineer, hack, or compromise our AI models or infrastructure</li>
                <li>Use the Service for any commercial purpose without proper licensing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive
                property of Joyoda Smart and its licensors. The Service is protected by copyright, trademark, and other
                laws.
              </p>
              <p className="text-gray-700 mb-4">
                You retain ownership of the images you upload to our Service. By using our Service, you grant us a
                limited, non-exclusive license to process your images solely for the purpose of providing our AI-powered
                editing services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Our Service operates on a credit-based system. Credits are consumed when you use our AI tools. Payment
                for credits and subscriptions is processed through secure third-party payment processors.
              </p>
              <p className="text-gray-700 mb-4">
                All payments are non-refundable except as required by law. We reserve the right to change our pricing at
                any time with reasonable notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Joyoda Smart, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever, including without limitation if you
                breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: support@joyoda.com
                <br />
                Website: https://joyoda.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
