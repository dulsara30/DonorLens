// Terms & Conditions and Privacy Policy page for DonorLens
// Universal page for all users, donors, and NGOs

import { useState } from 'react';
import AuthHeader from '../components/auth/AuthHeader';

const TermsPage = () => {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'privacy'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Who do these terms apply to?",
      answer: "These terms apply to all users of DonorLens, including individual donors, NGO administrators, and visitors browsing campaigns. By using our platform, you agree to abide by these terms."
    },
    {
      question: "How do you protect my personal information?",
      answer: "We use industry-standard encryption (SSL/TLS) to protect data in transit, secure servers for storage, and strict access controls. We never sell your personal information to third parties. Read our Privacy Policy for complete details."
    },
    {
      question: "Can I donate anonymously?",
      answer: "Yes, you can choose to donate anonymously. Your name will not be publicly displayed on campaign pages, though we maintain records for legal and tax purposes as required by law."
    },
    {
      question: "What happens if an NGO misuses funds?",
      answer: "We have strict transparency requirements. NGOs must provide proof of expenses and impact reports. If fraud is detected, we suspend the account, refund affected donors where possible, and report to authorities."
    },
    {
      question: "How can I delete my account?",
      answer: "You can request account deletion by contacting support@donorlens.org. We'll delete your personal information within 30 days, though we may retain certain records for legal compliance."
    },
    {
      question: "Are donations tax-deductible?",
      answer: "Tax deductibility depends on the NGO's status and your local tax laws. Many verified NGOs on our platform are registered charities. Check with the specific NGO and consult a tax professional."
    },
    {
      question: "How do you verify NGOs?",
      answer: "We verify registration documents, conduct background checks, review past activities, and assess transparency measures. Only NGOs that pass our verification process can create campaigns."
    },
    {
      question: "Can I get a refund for my donation?",
      answer: "Donations are generally final once processed. However, if fraud or misrepresentation is confirmed, we work to facilitate refunds. Contact support within 48 hours of donation for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <AuthHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-cyan-600 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms &amp; Privacy Policy
          </h1>
          <p className="text-xl text-teal-50">
            Your trust matters. Learn how we protect your rights and data.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'terms'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'privacy'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
          </div>

          {/* Sidebar - FAQ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="#14b8a6" strokeWidth="2" />
                    <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 17H12.01" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Frequently Asked
                </h3>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="text-sm font-medium text-slate-900">
                          {faq.question}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`shrink-0 transition-transform ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      {openFaqIndex === index && (
                        <div className="px-4 py-3 bg-white">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Still have questions?</p>
                  <a
                    href="mailto:support@donorlens.org"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">
            Last Updated: February 20, 2026 | © 2026 DonorLens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Terms of Service Content Component
const TermsContent = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-10 shadow-sm">
    <div className="prose prose-slate max-w-none">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Terms of Service</h2>
        <p className="text-slate-600">Effective Date: February 20, 2026</p>
      </div>

      {/* Section 1 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Acceptance of Terms</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          By accessing or using DonorLens ("Platform," "Service," "we," "us," or "our"), you
          agree to be bound by these Terms of Service. If you do not agree, please do not use
          our Platform.
        </p>
        <p className="text-slate-700 leading-relaxed">
          These terms apply to all users, including but not limited to individual donors, NGO
          administrators, campaign creators, and casual visitors.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">2. User Accounts</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Registration:</strong> To access certain features, you must create an account
          by providing accurate and complete information.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-3">
          <li>You must be at least 18 years old to create an account</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You agree to notify us immediately of any unauthorized use of your account</li>
          <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Platform Use</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Permitted Use:</strong> You may use DonorLens to browse campaigns, make
          donations, create campaigns (if verified), and engage with our community.
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Prohibited Activities:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>Fraudulent campaigns or misrepresentation of fund usage</li>
          <li>Harassment, abuse, or threatening behavior toward other users</li>
          <li>Uploading malicious code, viruses, or harmful content</li>
          <li>Attempting to circumvent security measures or access restricted areas</li>
          <li>Using the Platform for illegal activities</li>
          <li>Impersonating others or creating fake accounts</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Donations &amp; Payments</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Processing:</strong> All donations are processed securely through third-party
          payment providers. DonorLens does not store payment card information.
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Finality:</strong> Donations are generally final. Refunds are granted only in
          cases of proven fraud or technical errors.
        </p>
        <p className="text-slate-700 leading-relaxed">
          <strong>Tax Receipts:</strong> We facilitate tax receipts where applicable, but
          tax-deductibility depends on the NGO's status and your jurisdiction.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">5. NGO Responsibilities</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          NGOs using DonorLens agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>Provide accurate and truthful campaign information</li>
          <li>Use donated funds solely for stated campaign purposes</li>
          <li>Upload proof of expenses and maintain transparency</li>
          <li>Publish impact reports upon campaign completion</li>
          <li>Respond to donor inquiries promptly and professionally</li>
          <li>Maintain valid registration and legal compliance</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Intellectual Property</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          All content on DonorLens, including logos, text, graphics, and software, is owned by
          DonorLens or its licensors and protected by copyright and trademark laws.
        </p>
        <p className="text-slate-700 leading-relaxed">
          <strong>User Content:</strong> By uploading content (photos, descriptions, reports),
          you grant us a non-exclusive license to use, display, and distribute it on the Platform.
        </p>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">7. Disclaimers &amp; Limitations</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Platform Availability:</strong> We strive for 99.9% uptime but cannot guarantee
          uninterrupted service. Maintenance windows will be communicated in advance.
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Third-Party Actions:</strong> We are not liable for actions taken by NGOs or
          donors. We act as a facilitator and do not guarantee campaign success or fund delivery.
        </p>
        <p className="text-slate-700 leading-relaxed">
          <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, our
          liability is limited to the amount paid by you in the past 12 months.
        </p>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">8. Dispute Resolution</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Informal Resolution:</strong> We encourage users to contact us first to resolve
          disputes informally.
        </p>
        <p className="text-slate-700 leading-relaxed">
          <strong>Arbitration:</strong> Any unresolved disputes will be settled through binding
          arbitration in accordance with the laws of [Your Jurisdiction].
        </p>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">9. Changes to Terms</h3>
        <p className="text-slate-700 leading-relaxed">
          We may update these terms periodically. Material changes will be communicated via
          email or prominent notice on the Platform. Continued use after changes constitutes
          acceptance.
        </p>
      </section>

      {/* Section 10 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">10. Contact Us</h3>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
          <p className="text-slate-700 mb-2">
            <strong>Email:</strong>{' '}
            <a
              href="mailto:legal@donorlens.org"
              className="text-teal-600 hover:text-teal-700"
            >
              legal@donorlens.org
            </a>
          </p>
          <p className="text-slate-700 mb-2">
            <strong>Support:</strong>{' '}
            <a
              href="mailto:support@donorlens.org"
              className="text-teal-600 hover:text-teal-700"
            >
              support@donorlens.org
            </a>
          </p>
          <p className="text-slate-700">
            <strong>Response Time:</strong> Within 48 hours
          </p>
        </div>
      </section>
    </div>
  </div>
);

// Privacy Policy Content Component
const PrivacyContent = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-8 md:p-10 shadow-sm">
    <div className="prose prose-slate max-w-none">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Privacy Policy</h2>
        <p className="text-slate-600">Effective Date: February 20, 2026</p>
      </div>

      {/* Section 1 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">1. Information We Collect</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Personal Information:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
          <li>Name, email address, phone number</li>
          <li>Payment information (processed securely by third parties)</li>
          <li>Profile information and preferences</li>
          <li>For NGOs: Registration documents, organizational details</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Automatically Collected:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>Device information (browser, IP address, device type)</li>
          <li>Usage data (pages visited, time spent, interactions)</li>
          <li>Cookies and tracking technologies</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">2. How We Use Your Information</h3>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>To process donations and facilitate campaigns</li>
          <li>To verify NGO identity and authenticity</li>
          <li>To send transaction confirmations and updates</li>
          <li>To improve Platform features and user experience</li>
          <li>To prevent fraud and ensure security</li>
          <li>To comply with legal obligations</li>
          <li>To send promotional emails (with your consent, opt-out available)</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">3. Information Sharing</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>We never sell your personal information.</strong> We share data only in these scenarios:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>
            <strong>With NGOs:</strong> When you donate, your name and email (unless anonymous)
            are shared with the NGO for receipts and updates
          </li>
          <li>
            <strong>Service Providers:</strong> Payment processors, email services, analytics
            tools (under strict confidentiality agreements)
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law, court order, or to
            protect rights and safety
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale
            (with notice to you)
          </li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">4. Data Security</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          We implement industry-standard security measures:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li>SSL/TLS encryption for data transmission</li>
          <li>Secure, encrypted databases</li>
          <li>Regular security audits and penetration testing</li>
          <li>Limited employee access with strict protocols</li>
          <li>Two-factor authentication options</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mt-3">
          <strong>Note:</strong> No system is 100% secure. We cannot guarantee absolute
          security but commit to best practices.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">5. Your Rights</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Access &amp; Correction:</strong> Request a copy of your data or correct inaccuracies
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Deletion:</strong> Request deletion of your account and personal data
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Opt-Out:</strong> Unsubscribe from marketing emails anytime
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          <strong>Data Portability:</strong> Request your data in a machine-readable format
        </p>
        <p className="text-slate-700 leading-relaxed">
          To exercise these rights, email{' '}
          <a href="mailto:privacy@donorlens.org" className="text-teal-600 hover:text-teal-700">
            privacy@donorlens.org
          </a>
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">6. Cookies &amp; Tracking</h3>
        <p className="text-slate-700 leading-relaxed mb-3">
          We use cookies to enhance your experience:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Essential Cookies:</strong> Required for Platform functionality</li>
          <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
          <li><strong>Preference Cookies:</strong> Remember your settings</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mt-3">
          You can manage cookie preferences in your browser settings. Disabling cookies may
          limit some features.
        </p>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">7. Children's Privacy</h3>
        <p className="text-slate-700 leading-relaxed">
          DonorLens is not intended for users under 18. We do not knowingly collect data from
          children. If you believe a child has provided us with information, contact us
          immediately for deletion.
        </p>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">8. International Users</h3>
        <p className="text-slate-700 leading-relaxed">
          If you access DonorLens from outside [Your Country], your data may be transferred to
          and stored in [Your Country]. By using the Platform, you consent to this transfer and
          processing.
        </p>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">9. Data Retention</h3>
        <p className="text-slate-700 leading-relaxed">
          We retain your data for as long as your account is active or as needed to provide
          services. After account deletion, we may retain certain information for legal compliance
          (e.g., tax records for 7 years).
        </p>
      </section>

      {/* Section 10 */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">10. Changes to This Policy</h3>
        <p className="text-slate-700 leading-relaxed">
          We may update this Privacy Policy periodically. Material changes will be communicated
          via email. The "Effective Date" at the top indicates the last update.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h3>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
          <p className="text-slate-700 mb-2">
            <strong>Privacy Officer:</strong>{' '}
            <a
              href="mailto:privacy@donorlens.org"
              className="text-teal-600 hover:text-teal-700"
            >
              privacy@donorlens.org
            </a>
          </p>
          <p className="text-slate-700 mb-2">
            <strong>General Support:</strong>{' '}
            <a
              href="mailto:support@donorlens.org"
              className="text-teal-600 hover:text-teal-700"
            >
              support@donorlens.org
            </a>
          </p>
          <p className="text-slate-700">
            <strong>Response Time:</strong> Within 48 hours
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default TermsPage;
