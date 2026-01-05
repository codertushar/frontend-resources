import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Github, Linkedin, MapPin, Clock } from 'lucide-react';
import { XIcon } from '../components/SocialIcons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Create mailto link with form data
    const mailtoLink = `mailto:hellokhannatushar@gmail.com?subject=${encodeURIComponent(
      formData.subject || 'Contact from CrackFrontend'
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoLink;

    setSubmitStatus('success');
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hellokhannatushar@gmail.com',
      link: 'mailto:hellokhannatushar@gmail.com',
      description: 'Best for detailed inquiries',
    },
    {
      icon: XIcon,
      title: 'X (Twitter)',
      value: '@iamtusharkhanna',
      link: 'https://x.com/iamtusharkhanna',
      description: 'Quick questions & updates',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      value: 'Tushar Khanna',
      link: 'https://www.linkedin.com/in/khannatushar/',
      description: 'Professional connections',
    },
  ];

  const faqs = [
    {
      question: 'How quickly do you respond?',
      answer: 'We typically respond within 24-48 hours on business days.',
    },
    {
      question: 'Can I request new topics?',
      answer: 'Absolutely! We welcome suggestions for new content and topics.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 7-day refund policy for premium access if not satisfied.',
    },
  ];

  return (
    <div className="container page-container">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-gradient">Get in Touch</h1>
        <p className="contact-subtitle">
          Have questions, feedback, or just want to say hello? We would love to hear from you.
        </p>
      </motion.div>

      <div className="contact-grid">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="contact-form-section glass-panel"
        >
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows={5}
                required
              />
            </div>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Opening email client...'
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
            {submitStatus === 'success' && (
              <p className="status-message success">
                Your email client should have opened. If not, please email us directly.
              </p>
            )}
          </form>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="contact-methods-section"
        >
          <h2>Other Ways to Reach Us</h2>
          <div className="contact-methods">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-method glass-panel animated-card subtle"
              >
                <div className="method-icon">
                  <method.icon size={20} />
                </div>
                <div className="method-info">
                  <h3>{method.title}</h3>
                  <p className="method-value">{method.value}</p>
                  <p className="method-description">{method.description}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="response-info glass-panel">
            <Clock size={20} />
            <div>
              <h3>Response Time</h3>
              <p>We typically respond within 24-48 hours</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="faq-section"
      >
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item glass-panel animated-card subtle">
              <MessageSquare size={20} className="faq-icon" />
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <style>{`
        .page-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .contact-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto 3rem;
        }

        .contact-form-section {
          padding: 2rem;
        }

        .contact-form-section h2 {
          color: var(--text-main);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: var(--text-main);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.875rem 1rem;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: var(--text-muted);
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .status-message {
          text-align: center;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .contact-methods-section h2 {
          color: var(--text-main);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .contact-method {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          text-decoration: none;
        }

        .method-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .method-info h3 {
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .method-value {
          color: var(--primary);
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .method-description {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .response-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
        }

        .response-info svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .response-info h3 {
          color: var(--text-main);
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }

        .response-info p {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .faq-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .faq-section h2 {
          text-align: center;
          color: var(--text-main);
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .faq-item {
          padding: 1.5rem;
        }

        .faq-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .faq-item h3 {
          color: var(--text-main);
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .faq-item p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .contact-header h1 {
            font-size: 2rem;
          }

          .contact-subtitle {
            font-size: 1rem;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }

          .contact-form-section,
          .faq-item {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
