import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, CreditCard, Scale, AlertTriangle, Mail, LucideIcon } from 'lucide-react';

interface Section {
  icon: LucideIcon;
  title: string;
  content: string;
}

const Terms: React.FC = () => {
  const lastUpdated = 'January 5, 2025';

  const sections: Section[] = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: `By accessing and using CrackFrontend ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our Service.

These terms apply to all visitors, users, and others who access or use the Service. By using our Service, you represent that you are at least 18 years old or have parental consent to use the Service.`,
    },
    {
      icon: FileText,
      title: 'Description of Service',
      content: `CrackFrontend provides educational content and resources for frontend development and technical interview preparation. Our Service includes:

• Free educational articles and resources
• Premium content accessible through paid subscription
• Interactive code examples and exercises
• Progress tracking and learning features

We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.`,
    },
    {
      icon: CreditCard,
      title: 'Payments & Subscriptions',
      content: `Premium Access is available as a one-time lifetime purchase. By purchasing Premium Access, you agree to the following:

• Payment is processed securely through Razorpay
• The purchase grants lifetime access to all current and future premium content
• Prices are subject to change, but existing purchases will be honored
• As this is a digital product with instant access, we do not offer refunds
• However, if you're unsatisfied with your purchase, please share your feedback with us
• We are committed to addressing your concerns and continuously improving our content

We take your satisfaction seriously and will work with you to ensure you get value from your purchase.`,
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      content: `All content on CrackFrontend, including but not limited to text, code examples, graphics, logos, and design, is the property of CrackFrontend and is protected by copyright laws.

You may:
• View and read content for personal, educational use
• Share links to our content
• Reference our content with proper attribution

You may not:
• Copy, reproduce, or distribute our content without permission
• Use our content for commercial purposes
• Create derivative works based on our content
• Remove or alter any copyright notices

Code examples provided are for educational purposes. You may use them in your personal projects, but they should not be used as the basis for competing educational content.`,
    },
    {
      icon: XCircle,
      title: 'Prohibited Activities',
      content: `When using our Service, you agree not to:

• Share your account credentials with others
• Attempt to circumvent our premium content protection
• Use automated tools to scrape or download content
• Engage in any activity that disrupts or interferes with the Service
• Impersonate others or provide false information
• Use the Service for any illegal purpose
• Violate any applicable laws or regulations

We reserve the right to terminate accounts that violate these terms without refund.`,
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimers & Limitations',
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.

• We do not guarantee that our content will help you pass any specific interview
• Information provided is for educational purposes only
• We are not responsible for decisions made based on our content
• We make no guarantees about the accuracy or completeness of our content
• We are not liable for any indirect, incidental, or consequential damages

Our total liability for any claim arising from your use of the Service is limited to the amount you paid for Premium Access, if any.`,
    },
  ];

  return (
    <div className="container page-container">
      <motion.div
        className="terms-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-icon">
          <FileText size={40} />
        </div>
        <h1 className="heading-gradient">Terms of Service</h1>
        <p className="terms-subtitle">
          Please read these terms carefully before using CrackFrontend.
        </p>
        <p className="last-updated">Last updated: {lastUpdated}</p>
      </motion.div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="quick-summary glass-panel"
      >
        <h2>Key Points</h2>
        <div className="key-points">
          <div className="key-point">
            <CheckCircle size={18} className="point-icon green" />
            <span>Commitment to addressing feedback and concerns</span>
          </div>
          <div className="key-point">
            <CheckCircle size={18} className="point-icon green" />
            <span>Lifetime access to premium content</span>
          </div>
          <div className="key-point">
            <CheckCircle size={18} className="point-icon green" />
            <span>Use code examples in your personal projects</span>
          </div>
          <div className="key-point">
            <XCircle size={18} className="point-icon red" />
            <span>No account sharing allowed</span>
          </div>
          <div className="key-point">
            <XCircle size={18} className="point-icon red" />
            <span>No content redistribution</span>
          </div>
        </div>
      </motion.div>

      {/* Terms Sections */}
      <div className="terms-sections">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="terms-section glass-panel"
          >
            <div className="section-header">
              <div className="section-icon">
                <section.icon size={24} />
              </div>
              <h2>{section.title}</h2>
            </div>
            <div className="section-content">
              {section.content.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Governing Law */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="governing-law glass-panel"
      >
        <Scale size={24} className="law-icon" />
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India.
          Any disputes arising from these terms shall be subject to the exclusive jurisdiction
          of the courts in India.
        </p>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="contact-section glass-panel"
      >
        <Mail size={24} className="contact-icon" />
        <h2>Questions About These Terms?</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <a href="mailto:iamtusharkhanna@gmail.com" className="contact-email">
          iamtusharkhanna@gmail.com
        </a>
      </motion.div>

      <style>{`
        .page-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .terms-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .terms-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .terms-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto 1rem;
        }

        .last-updated {
          font-size: 0.9rem;
          color: var(--text-muted);
          opacity: 0.8;
        }

        .quick-summary {
          max-width: 800px;
          margin: 0 auto 3rem;
          padding: 2rem;
        }

        .quick-summary h2 {
          color: var(--text-main);
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .key-points {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .key-point {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .point-icon {
          flex-shrink: 0;
        }

        .point-icon.green {
          color: #22c55e;
        }

        .point-icon.red {
          color: #ef4444;
        }

        .terms-sections {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .terms-section {
          padding: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .section-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .section-header h2 {
          color: var(--text-main);
          font-size: 1.35rem;
          margin: 0;
        }

        .section-content {
          margin-left: 4rem;
        }

        .section-content p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.8;
          margin-bottom: 1rem;
          white-space: pre-line;
        }

        .section-content p:last-child {
          margin-bottom: 0;
        }

        .governing-law {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          text-align: center;
        }

        .law-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .governing-law h2 {
          color: var(--text-main);
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .governing-law p {
          color: var(--text-muted);
          line-height: 1.7;
        }

        .contact-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }

        .contact-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .contact-section h2 {
          color: var(--text-main);
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .contact-section p {
          color: var(--text-muted);
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .contact-email {
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-email:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .terms-header h1 {
            font-size: 2rem;
          }

          .terms-subtitle {
            font-size: 1rem;
          }

          .header-icon {
            width: 64px;
            height: 64px;
            border-radius: 16px;
          }

          .section-content {
            margin-left: 0;
          }

          .terms-section,
          .quick-summary,
          .governing-law,
          .contact-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Terms;
