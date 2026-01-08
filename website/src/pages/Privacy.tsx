import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Cookie, Mail, Bell, RefreshCw, LucideIcon } from 'lucide-react';

interface ContentItem {
  subtitle: string;
  text: string;
}

interface PolicySection {
  icon: LucideIcon;
  title: string;
  content: ContentItem[];
}

const Privacy: React.FC = () => {
  const lastUpdated = 'January 5, 2025';

  const sections: PolicySection[] = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your email address and name through Google OAuth authentication. We do not store your Google password.',
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including pages viewed, features used, and time spent on the site. This helps us improve our content and user experience.',
        },
        {
          subtitle: 'Payment Information',
          text: 'Payment processing is handled securely by Razorpay. We do not store your credit card details or banking information on our servers.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        {
          subtitle: 'Service Delivery',
          text: 'We use your information to provide access to our educational content, manage your subscription, and track your learning progress.',
        },
        {
          subtitle: 'Communication',
          text: 'We may send you important updates about your account, new features, or content updates. You can opt out of marketing communications at any time.',
        },
        {
          subtitle: 'Improvement',
          text: 'We analyze usage patterns to improve our content, fix issues, and develop new features that better serve our users.',
        },
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        {
          subtitle: 'Encryption',
          text: 'All data transmitted between your browser and our servers is encrypted using HTTPS/TLS protocols.',
        },
        {
          subtitle: 'Secure Storage',
          text: 'User data is stored in secure databases with restricted access. We use industry-standard security measures to protect your information.',
        },
        {
          subtitle: 'Third-Party Services',
          text: 'We use trusted third-party services (Supabase for authentication, Razorpay for payments, Vercel for hosting) that maintain their own security standards.',
        },
      ],
    },
    {
      icon: Cookie,
      title: 'Cookies & Tracking',
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'We use essential cookies to maintain your session and remember your preferences. These are necessary for the site to function properly.',
        },
        {
          subtitle: 'Analytics',
          text: 'We use Vercel Analytics to understand how users interact with our site. This data is anonymized and helps us improve the user experience.',
        },
        {
          subtitle: 'Your Choice',
          text: 'You can disable cookies in your browser settings, though this may affect some site functionality.',
        },
      ],
    },
    {
      icon: Bell,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access & Export',
          text: 'You can request a copy of your personal data at any time by contacting us.',
        },
        {
          subtitle: 'Deletion',
          text: 'You can request deletion of your account and associated data. Some data may be retained for legal or security purposes.',
        },
        {
          subtitle: 'Correction',
          text: 'If any of your information is incorrect, you can update it through your account settings or contact us for assistance.',
        },
      ],
    },
    {
      icon: RefreshCw,
      title: 'Policy Updates',
      content: [
        {
          subtitle: 'Changes',
          text: 'We may update this privacy policy from time to time. Significant changes will be communicated via email or a prominent notice on our site.',
        },
        {
          subtitle: 'Continued Use',
          text: 'Your continued use of CrackFrontend after policy changes constitutes acceptance of the updated terms.',
        },
      ],
    },
  ];

  return (
    <div className="container page-container">
      <motion.div
        className="privacy-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-icon">
          <Shield size={40} />
        </div>
        <h1 className="heading-gradient">Privacy Policy</h1>
        <p className="privacy-subtitle">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
        <h2>Quick Summary</h2>
        <ul>
          <li>We collect only essential information needed to provide our service</li>
          <li>Your payment details are handled securely by Razorpay - we never store them</li>
          <li>We use cookies for functionality and analytics, not for advertising</li>
          <li>You can request deletion of your data at any time</li>
          <li>We never sell your personal information to third parties</li>
        </ul>
      </motion.div>

      {/* Policy Sections */}
      <div className="policy-sections">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="policy-section glass-panel"
          >
            <div className="section-header">
              <div className="section-icon">
                <section.icon size={24} />
              </div>
              <h2>{section.title}</h2>
            </div>
            <div className="section-content">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className="content-item">
                  <h3>{item.subtitle}</h3>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="contact-section glass-panel"
      >
        <Mail size={24} className="contact-icon" />
        <h2>Questions or Concerns?</h2>
        <p>
          If you have any questions about this privacy policy or how we handle your data,
          please contact us at:
        </p>
        <a href="mailto:hellokhannatushar@gmail.com" className="contact-email">
          hellokhannatushar@gmail.com
        </a>
      </motion.div>

      <style>{`
        .page-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .privacy-header {
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

        .privacy-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .privacy-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
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
          margin-bottom: 1rem;
        }

        .quick-summary ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quick-summary li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .quick-summary li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #22c55e;
          font-weight: bold;
        }

        .quick-summary li:last-child {
          margin-bottom: 0;
        }

        .policy-sections {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .policy-section {
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
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-left: 4rem;
        }

        .content-item h3 {
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .content-item p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        .contact-section {
          max-width: 600px;
          margin: 3rem auto 0;
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
          .privacy-header h1 {
            font-size: 2rem;
          }

          .privacy-subtitle {
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

          .policy-section,
          .quick-summary,
          .contact-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;
