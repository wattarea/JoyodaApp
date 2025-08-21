"use client"

import { Modal } from "@/components/ui/modal"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">Last updated: December 2024</p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
        <p className="text-gray-700 mb-4">
          We collect information you provide directly to us, such as when you create an account, use our services, or
          contact us for support.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>To provide, maintain, and improve our AI image editing services</li>
          <li>To process your images using our AI algorithms</li>
          <li>To manage your account and provide customer support</li>
          <li>To send you technical notices and support messages</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Information Sharing</h3>
        <p className="text-gray-700 mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
          except as described in this policy.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Data Security</h3>
        <p className="text-gray-700 mb-4">
          We implement appropriate security measures to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Image Processing</h3>
        <p className="text-gray-700 mb-4">
          Images you upload are processed by our AI systems to provide the requested editing services. We do not use
          your images to train our AI models without explicit consent.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Data Retention</h3>
        <p className="text-gray-700 mb-4">
          We retain your personal information and uploaded images only for as long as necessary to provide our services
          and comply with legal obligations.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Your Rights</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Access and update your personal information</li>
          <li>Delete your account and associated data</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Contact Us</h3>
        <p className="text-gray-700">
          If you have questions about this Privacy Policy, please contact us at:{" "}
          <a href="mailto:privacy@joyoda.com" className="text-purple-600 hover:underline">
            privacy@joyoda.com
          </a>
        </p>
      </div>
    </Modal>
  )
}
