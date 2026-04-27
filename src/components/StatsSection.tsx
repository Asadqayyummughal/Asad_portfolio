import './StatsSection.css';
import { Calendar, Briefcase, Users, Trophy, ArrowRight } from 'lucide-react';

const stats = [
  { value: '5+', label: 'Years Experience', icon: Calendar },
  { value: '30+', label: 'Projects Completed', icon: Briefcase },
  { value: '20+', label: 'Happy Clients', icon: Users },
  { value: '5', label: 'Awards Received', icon: Trophy },
];

const StatsSection = () => {
  return (
    <section id="about" className="stats-section">
      {/* Left: coral panel */}
      <div className="stats-coral-panel">
        <div className="stats-coral-panel__inner animate-fade-in-left reveal-on-scroll">
          <span className="section-label stats-label">About Me</span>
          <div className="section-label-line" />
          <h2 className="section-title-serif stats-title-white">
            Building Digital<br />Solutions That<br />Make Impact
          </h2>
          <p className="stats-desc">
            I am Asad Ali Janjua, a Full Stack Web Developer with 5 years of experience designing and developing web applications. I specialize in modern JavaScript frameworks and technologies.
          </p>
          <button className="btn-pill" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Work With Me <ArrowRight size={16} />
          </button>
        </div>

        {/* Decorative elements on coral panel */}
        <div className="deco-circle stats-deco-1" />
        <div className="dot-matrix stats-dot" />
      </div>

      {/* Right: stats grid */}
      <div className="stats-right animate-fade-in-right reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="stat-card animate-scale-in reveal-on-scroll"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="stat-icon-wrap">
                  <Icon size={26} />
                </div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
