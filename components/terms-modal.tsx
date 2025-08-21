"use client"

import { Modal } from "@/components/ui/modal"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-600 mb-6">Last updated: December 2024</p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
        <p className="text-gray-700 mb-4">
          By accessing and using Joyoda Smart ("Service"), you accept and agree to be bound by the terms and provision
          of this agreement.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Description of Service</h3>
        <p className="text-gray-700 mb-4">
          Joyoda Smart is an AI-powered image editing platform that provides various tools for image manipulation,
          enhancement, and creative transformation using artificial intelligence technology.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">3. User Responsibilities</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>You must provide accurate and complete information when creating an account</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You must not use the service for any illegal or unauthorized purpose</li>
          <li>You must not upload content that violates intellectual property rights</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Acceptable Use Policy</h3>
        <p className="text-gray-700 mb-4">
          You agree not to use the service to upload, process, or generate content that is illegal, harmful,
          threatening, abusive, defamatory, or otherwise objectionable.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Payment Terms</h3>
        <p className="text-gray-700 mb-4">
          Our service operates on a credit-based system. Credits are consumed when using AI tools. Subscription plans
          and credit packages are available for purchase.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Intellectual Property</h3>
        <p className="text-gray-700 mb-4">
          You retain ownership of the images you upload. By using our service, you grant us a limited license to process
          your images for the purpose of providing our services.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
        <p className="text-gray-700 mb-4">
          Joyoda Smart shall not be liable for any indirect, incidental, special, consequential, or punitive damages
          resulting from your use of the service.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">8. Contact Information</h3>
        <p className="text-gray-700">
          For questions about these Terms of Service, please contact us at:{" "}
          <a href="mailto:support@joyoda.com" className="text-purple-600 hover:underline">
            support@joyoda.com
          </a>
        </p>
      </div>
    </Modal>
  )
}
