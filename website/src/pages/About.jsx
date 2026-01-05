import { motion } from 'framer-motion';
import { BookOpen, Code, Users, Target, Heart, Zap, Github, Linkedin, Mail } from 'lucide-react';
import { XIcon } from '../components/SocialIcons';

const About = () => {
  const stats = [
    { label: 'Resources', value: '100+' },
    { label: 'Topics Covered', value: '15+' },
    { label: 'Code Examples', value: '500+' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Interview-Focused',
      description: 'Every resource is crafted with frontend interviews in mind, covering what actually gets asked.',
    },
    {
      icon: Code,
      title: 'Practical Examples',
      description: 'Real-world code snippets and implementations you can use immediately in your projects.',
    },
    {
      icon: Zap,
      title: 'Always Updated',
      description: 'Content is continuously updated to reflect the latest frontend trends and best practices.',
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Built with feedback from developers who have successfully cracked their interviews.',
    },
  ];

  return (
    <div className="container page-container">
      <motion.div
        className="about-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="heading-gradient">About CrackFrontend</h1>
        <p className="about-subtitle">
          Your comprehensive resource for mastering frontend development and acing technical interviews.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="stats-bar glass-panel"
      >
        {stats.map((stat, index) => (
          <div key={index} className="stat">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="about-section glass-panel"
      >
        <h2>Our Mission</h2>
        <p>
          CrackFrontend was created to help developers prepare for frontend interviews with confidence.
          We believe that everyone deserves access to high-quality learning resources that bridge the gap
          between theoretical knowledge and practical interview requirements.
        </p>
        <p>
          Our platform provides carefully curated content covering JavaScript fundamentals, data structures,
          algorithms, system design, machine coding challenges, and modern frontend frameworks. Each topic
          is explained with real-world examples and interview-focused insights.
        </p>
      </motion.section>

      {/* Values Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="values-section"
      >
        <h2>What Sets Us Apart</h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="value-card glass-panel animated-card subtle"
            >
              <div className="value-icon">
                <value.icon size={24} />
              </div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Creator Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="creator-section glass-panel"
      >
        <h2>Meet the Creator</h2>
        <div className="creator-content">
          <div className="creator-info">
            <h3>Tushar Khanna</h3>
            <p className="creator-role">Frontend Engineer</p>
            <p className="creator-bio">
              With years of experience in frontend development and a passion for teaching,
              I created CrackFrontend to share the knowledge and insights that helped me
              succeed in technical interviews at top tech companies.
            </p>
            <div className="creator-links">
              <a href="mailto:hellokhannatushar@gmail.com" className="creator-link" title="Email">
                <Mail size={18} />
              </a>
              <a href="https://x.com/iamtusharkhanna" target="_blank" rel="noopener noreferrer" className="creator-link" title="X (Twitter)">
                <XIcon size={16} />
              </a>
              <a href="https://www.linkedin.com/in/khannatushar/" target="_blank" rel="noopener noreferrer" className="creator-link" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com/codertushar" target="_blank" rel="noopener noreferrer" className="creator-link" title="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="cta-section glass-panel"
      >
        <BookOpen size={40} className="cta-icon" />
        <h2>Ready to Start Learning?</h2>
        <p>Explore our comprehensive library of frontend resources and start your journey today.</p>
        <a href="/library" className="cta-button">
          Browse Resources
        </a>
      </motion.section>

      <style>{`
        .page-container {
          padding-top: 2rem;
          padding-bottom: 4rem;
        }

        .about-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .about-header h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .about-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4rem;
          padding: 2rem;
          margin-bottom: 3rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .about-section {
          max-width: 800px;
          margin: 0 auto 3rem;
          padding: 2.5rem;
        }

        .about-section h2 {
          color: var(--text-main);
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }

        .about-section p {
          color: var(--text-muted);
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .about-section p:last-child {
          margin-bottom: 0;
        }

        .values-section {
          max-width: 900px;
          margin: 0 auto 3rem;
        }

        .values-section h2 {
          text-align: center;
          color: var(--text-main);
          margin-bottom: 2rem;
          font-size: 1.75rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .value-card {
          padding: 2rem;
          text-align: center;
        }

        .value-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          color: white;
        }

        .value-card h3 {
          color: var(--text-main);
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .value-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .creator-section {
          max-width: 800px;
          margin: 0 auto 3rem;
          padding: 2.5rem;
        }

        .creator-section h2 {
          color: var(--text-main);
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }

        .creator-content {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .creator-info {
          flex: 1;
        }

        .creator-info h3 {
          color: var(--text-main);
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .creator-role {
          color: var(--primary);
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .creator-bio {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .creator-links {
          display: flex;
          gap: 1rem;
        }

        .creator-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface-hover);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .creator-link:hover {
          color: var(--primary);
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .cta-section {
          max-width: 600px;
          margin: 0 auto;
          padding: 3rem;
          text-align: center;
        }

        .cta-icon {
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .cta-section h2 {
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .cta-section p {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--primary), #a78bfa);
          color: white;
          padding: 0.875rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
        }

        @media (max-width: 768px) {
          .about-header h1 {
            font-size: 2rem;
          }

          .about-subtitle {
            font-size: 1rem;
          }

          .stats-bar {
            flex-direction: column;
            gap: 1.5rem;
          }

          .stat-value {
            font-size: 2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .about-section,
          .creator-section,
          .cta-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
