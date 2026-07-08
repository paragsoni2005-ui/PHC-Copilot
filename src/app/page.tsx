"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SplashScreen from "@/components/SplashScreen";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Pill, 
  TrendingUp, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  ArrowRight, 
  Lock, 
  FileText,
  Clock,
  LayoutDashboard,
  Database
} from "lucide-react";

export default function RootPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"receptionist" | "medical_officer" | null>(null);
  
  // Auth Form State
  const [email, setEmail] = useState("mo@phc.gov.in");
  const [password, setPassword] = useState("password123");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const { role, signInAsReceptionist, signInAsMedicalOfficer } = useAuth();
  const router = useRouter();

  const handleSplashFinished = () => {
    setShowSplash(false);
  };

  // Authentication checks bypassed as request to disable auth
  const handleRoleSelect = (roleType: "receptionist" | "medical_officer") => {
    if (roleType === "receptionist") {
      router.push("/opd-registration");
    } else {
      router.push("/dashboard");
    }
  };

  if (showSplash) {
    return <SplashScreen onFinished={handleSplashFinished} />;
  }

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <div className="landing-container">
      {/* Top Navbar */}
      <nav className="landing-nav glass-nav">
        <div className="nav-brand">
          <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
            <path d="M38 12C38 8.68629 40.6863 6 44 6H76C79.3137 6 82 8.68629 82 12V38H108C111.314 38 114 40.6863 114 44V76C114 79.3137 111.314 82 108 82H82V108C82 111.314 79.3137 114 76 114H44C40.6863 114 38 111.314 38 108V82H12C8.68629 82 6 79.3137 6 76V44C6 40.6863 8.68629 38 12 38H38V12Z" fill="var(--color-clinical-teal)" />
            <path d="M90 6C90 19.2548 76.7452 32.51 90 32.51C90 45.765 103.255 32.51 90 32.51C90 19.2548 103.255 6 90 6Z" fill="var(--color-secondary)" />
          </svg>
          <span className="nav-logo-text">PHC Copilot</span>
        </div>
        <div className="nav-links">
          <a href="#problem">Problem</a>
          <a href="#solution">Solution</a>
          <a href="#workflow">Workflow</a>
          <a href="#features">Features</a>
          <a href="#technology">Tech Stack</a>
          <a href="#impact">Expected Impact</a>
        </div>
        <div className="nav-actions">
          <button className="btn-nav-primary" onClick={() => handleRoleSelect("medical_officer")}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <motion.div 
          className="hero-text-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge-vision">
            <Sparkles size={14} className="sparkle-icon-spin" />
            <span>Smart Health OS for Rural PHCs</span>
          </span>
          <h1 className="hero-main-title">
            From Paper to Intelligence.
          </h1>
          <p className="hero-subtitle">
            Digitize OPD registration, monitor clinic operations, and receive AI-powered recommendations in real time using Google Cloud and Gemini.
          </p>

          {/* Core Call to Actions */}
          <div className="hero-cta-group">
            <button 
              className="cta-button primary-cta ripple-effect"
              onClick={() => handleRoleSelect("receptionist")}
            >
              <span>Register Patients (Receptionist)</span>
              <ArrowRight size={18} />
            </button>
            <button 
              className="cta-button secondary-cta"
              onClick={() => handleRoleSelect("medical_officer")}
            >
              <span>Medical Officer Dashboard</span>
              <LayoutDashboard size={18} />
            </button>
          </div>
        </motion.div>

        {/* Hero Dynamic Graphics */}
        <motion.div 
          className="hero-graphic"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="preview-container glass-container">
            <div className="preview-header">
              <div className="header-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="header-bar">phc-copilot.gov.in/dashboard</div>
            </div>
            <div className="preview-body">
              <div className="mock-chart-box">
                <div className="mock-spark-box flex-between">
                  <span className="flex-center gap-1 text-teal font-semibold"><Sparkles size={14} /> AI Recommendation</span>
                  <span className="badge-glow">94% Confidence</span>
                </div>
                <div className="mock-text-line short"></div>
                <div className="mock-text-line long"></div>
                <div className="mock-graph">
                  <div className="graph-bar" style={{ height: "40%" }}></div>
                  <div className="graph-bar" style={{ height: "65%" }}></div>
                  <div className="graph-bar" style={{ height: "50%" }}></div>
                  <div className="graph-bar highlight" style={{ height: "85%" }}></div>
                  <div className="graph-bar" style={{ height: "60%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem We Solve */}
      <section id="problem" className="problem-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="section-label">Operational Gap</span>
          <h2 className="section-title">The Rural Healthcare Challenge</h2>
        </motion.div>

        <motion.div 
          className="problem-cards-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div className="problem-card glass-container" variants={itemVariants}>
            <Clock className="card-icon text-red" size={28} />
            <h3>Paper registers consume time</h3>
            <p>Receptionists spend valuable patient triage time writing log books manually.</p>
          </motion.div>
          
          <motion.div className="problem-card glass-container" variants={itemVariants}>
            <Users className="card-icon text-orange" size={28} />
            <h3>Patient counting is manual</h3>
            <p>Calculating surge levels and clinic metrics requires manual tally calculations.</p>
          </motion.div>

          <motion.div className="problem-card glass-container" variants={itemVariants}>
            <FileText className="card-icon text-red" size={28} />
            <h3>Reporting requires extra effort</h3>
            <p>Generating daily logs and reporting up the chain diverts resources from care.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Our Solution */}
      <section id="solution" className="solution-section">
        <div className="solution-split">
          <motion.div 
            className="solution-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-label">Digital Blueprint</span>
            <h2 className="section-title">A Unified Digital OPD Register</h2>
            <p className="solution-desc">
              By replacing paper registers with a lightweight, cloud-synchronized registration form, PHC Copilot captures operational metrics right at the clinic entrance.
            </p>
            <div className="solution-bullets">
              <div className="bullet-item">
                <div className="bullet-icon flex-center"><Sparkles size={16} /></div>
                <div>
                  <h4>Triage under 30 seconds</h4>
                  <p>Fast intake fields designed with standard shortcuts for rapid entry.</p>
                </div>
              </div>
              <div className="bullet-item">
                <div className="bullet-icon flex-center"><Database size={16} /></div>
                <div>
                  <h4>Zero-refresh live updates</h4>
                  <p>Firestore triggers sync new entries instantly with the Medical Officer&apos;s view.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section id="workflow" className="workflow-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="section-label">Process Roadmap</span>
          <h2 className="section-title">How It Works</h2>
        </motion.div>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>
          
          <div className="timeline-steps">
            <div className="timeline-step">
              <div className="step-number flex-center">1</div>
              <div className="step-card glass-container">
                <h4>Patient Arrives</h4>
                <p>Patient arrives at the primary health care clinic seeking treatment.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number flex-center">2</div>
              <div className="step-card glass-container">
                <h4>Reception Registers</h4>
                <p>Digital registration form saves entry to Firestore in real-time.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number flex-center">3</div>
              <div className="step-card glass-container">
                <h4>Dashboard Updates</h4>
                <p>Medical Officer sees live patient counters and footfall metrics update instantly.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="step-number flex-center">4</div>
              <div className="step-card glass-container">
                <h4>Gemini Insights</h4>
                <p>AI engine runs on registration metrics to issue surge warnings and inventory recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Highlights */}
      <section id="features" className="features-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="section-label">Core Modules</span>
          <h2 className="section-title">Key Features & Capabilities</h2>
        </motion.div>

        <div className="features-grid">
          <div className="feature-card glass-container">
            <Users className="feature-icon" size={24} />
            <h4>OPD Registration</h4>
            <p>Digitally registers patient symptoms, villages, ages, and visits in Firestore.</p>
          </div>
          
          <div className="feature-card glass-container">
            <Pill className="feature-icon" size={24} />
            <h4>Medicine Inventory</h4>
            <p>Predicts stock remaining days based on live patient volumes.</p>
          </div>

          <div className="feature-card glass-container">
            <TrendingUp className="feature-icon" size={24} />
            <h4>Footfall Analytics</h4>
            <p>Visualizes peak surge hours and weekly patient trends via Recharts.</p>
          </div>

          <div className="feature-card glass-container">
            <Activity className="feature-icon" size={24} />
            <h4>Staff Attendance</h4>
            <p>Monitors doctor shifts and estimates surge patient wait times.</p>
          </div>

          <div className="feature-card glass-container">
            <Sparkles className="feature-icon" size={24} />
            <h4>AI Operations Briefing</h4>
            <p>Gemini generates natural language briefings and prioritizes checklists.</p>
          </div>

          <div className="feature-card glass-container">
            <ShieldAlert className="feature-icon" size={24} />
            <h4>Community Alerts</h4>
            <p>Triggers localized health alerts on detecting surge symptoms.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="tech-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="section-label">Under the Hood</span>
          <h2 className="section-title">Technology Stack</h2>
        </motion.div>

        <div className="tech-grid">
          <div className="tech-logo glass-container">
            <h4>Google Cloud</h4>
            <p>Database Infrastructure</p>
          </div>
          <div className="tech-logo glass-container">
            <h4>Vercel</h4>
            <p>Edge Deployment & Hosting</p>
          </div>
          <div className="tech-logo glass-container">
            <h4>Gemini 2.5 Flash</h4>
            <p>Operations AI Briefing</p>
          </div>
          <div className="tech-logo glass-container">
            <h4>Next.js 16</h4>
            <p>React Framework</p>
          </div>
          <div className="tech-logo glass-container">
            <h4>Cloud Firestore</h4>
            <p>Real-Time Sync</p>
          </div>
        </div>
      </section>

      {/* Expected Impact Section */}
      <section id="impact" className="impact-section">
        <motion.div 
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="section-label">Clinic Efficiency</span>
          <h2 className="section-title">Expected Impact</h2>
        </motion.div>

        <div className="impact-grid">
          <div className="impact-card glass-container">
            <h3>-90%</h3>
            <h4>Reduce Paperwork</h4>
            <p>Digitizes registration, rosters, and inventories to eliminate paper logs.</p>
          </div>
          
          <div className="impact-card glass-container">
            <h3>&lt;30s</h3>
            <h4>Faster Reporting</h4>
            <p>Generates end-of-day reports in one click via Gemini natural language engine.</p>
          </div>

          <div className="impact-card glass-container">
            <h3>Real-Time</h3>
            <h4>Roster Monitoring</h4>
            <p>Syncs physician availability and stock warnings across all devices instantly.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 PHC Copilot – AI Operating System for Rural Healthcare. Built with Google Cloud & Gemini.</p>
      </footer>

      {/* Styled JSX */}
      <style jsx global>{`
        /* Landing layout variables & styles */
        .landing-container {
          min-height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at 10% 20%, rgba(240, 249, 255, 0.4) 0%, rgba(247, 249, 251, 1) 90%);
          display: flex;
          flex-direction: column;
          font-family: var(--font-family);
        }

        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 48px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          z-index: 1000;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .glass-nav {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-primary);
        }

        .nav-links {
          display: flex;
          gap: 32px;
        }

        .nav-links a {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-on-surface-variant);
          transition: color 0.2s ease;
        }

        .nav-links a:hover {
          color: var(--color-clinical-teal);
        }

        .btn-nav-primary {
          background-color: var(--color-primary);
          color: var(--color-on-primary);
          padding: 8px 20px;
          border-radius: var(--rounded-default);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .btn-nav-primary:hover {
          background-color: var(--color-primary-container);
        }

        /* Hero */
        .hero-section {
          padding: 140px 48px 80px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          position: relative;
        }

        .hero-bg-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
          top: -100px;
          left: -100px;
          z-index: 0;
        }

        .hero-text-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 10;
        }

        .badge-vision {
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(13, 148, 136, 0.08);
          color: var(--color-clinical-teal);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: var(--rounded-full);
          border: 1px solid rgba(13, 148, 136, 0.15);
        }

        .sparkle-icon-spin {
          animation: spin 6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hero-main-title {
          font-size: 3rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          background: linear-gradient(135deg, var(--color-primary) 30%, var(--color-clinical-teal) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--color-on-surface-variant);
          line-height: 1.6;
          max-width: 540px;
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          margin-top: 16px;
        }

        .cta-button {
          padding: 14px 28px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .primary-cta {
          background-color: var(--color-clinical-teal);
          color: var(--color-on-primary);
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
        }

        .primary-cta:hover {
          background-color: #0b7a70;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
        }

        .secondary-cta {
          background-color: white;
          color: var(--color-primary);
          border: 1px solid var(--color-border-subtle);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
        }

        .secondary-cta:hover {
          background-color: var(--color-surface-container-low);
          transform: translateY(-2px);
        }

        .hero-graphic {
          display: flex;
          justify-content: center;
          z-index: 10;
        }

        .preview-container {
          width: 90%;
          border-radius: var(--rounded-lg);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border: 1px solid rgba(255,255,255,0.7);
        }

        .preview-header {
          background: rgba(255,255,255,0.5);
          height: 38px;
          border-bottom: 1px solid var(--color-border-subtle);
          display: flex;
          align-items: center;
          padding: 0 16px;
          position: relative;
        }

        .header-dots {
          display: flex;
          gap: 6px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: var(--rounded-full);
        }
        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .header-bar {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: var(--color-outline);
          background: white;
          padding: 2px 16px;
          border-radius: var(--rounded-sm);
          border: 1px solid var(--color-border-subtle);
        }

        .preview-body {
          padding: 20px;
          background: rgba(255,255,255,0.3);
        }

        .mock-chart-box {
          background: white;
          border-radius: var(--rounded-default);
          border: 1px solid var(--color-border-subtle);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mock-spark-box {
          font-size: 0.85rem;
        }

        .text-teal { color: var(--color-clinical-teal); }
        .font-semibold { font-weight: 600; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .gap-1 { gap: 4px; }

        .badge-glow {
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-clinical-teal);
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: var(--rounded-full);
        }

        .mock-text-line {
          height: 8px;
          background: var(--color-surface-container-highest);
          border-radius: 4px;
        }
        .mock-text-line.short { width: 40%; }
        .mock-text-line.long { width: 85%; }

        .mock-graph {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 100px;
          padding-top: 10px;
          border-bottom: 2px solid var(--color-border-subtle);
        }

        .graph-bar {
          width: 28px;
          background: var(--color-surface-container-highest);
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
        }

        .graph-bar.highlight {
          background: linear-gradient(to top, var(--color-clinical-teal) 0%, var(--color-secondary) 100%);
        }

        /* Sections common */
        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-clinical-teal);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 8px;
        }

        /* Problem Section */
        .problem-section {
          padding: 80px 48px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .problem-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .problem-card {
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .problem-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .problem-card p {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
          line-height: 1.5;
        }

        .card-icon {
          align-self: flex-start;
        }
        .text-red { color: var(--color-error); }
        .text-orange { color: var(--color-status-warning); }

        /* Solution Section */
        .solution-section {
          padding: 80px 48px;
          background: rgba(224, 242, 254, 0.15);
          border-top: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .solution-split {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
        }

        .solution-desc {
          font-size: 1.05rem;
          color: var(--color-on-surface-variant);
          margin-top: 16px;
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .solution-bullets {
          display: flex;
          flex-direction: column;
          gap: 24px;
          text-align: left;
          max-width: 500px;
          margin: 0 auto;
        }

        .bullet-item {
          display: flex;
          gap: 16px;
        }

        .bullet-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--rounded-default);
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-clinical-teal);
          flex-shrink: 0;
        }

        .bullet-item h4 {
          font-size: 1rem;
          font-weight: 700;
        }

        .bullet-item p {
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
        }

        .mock-form-card {
          width: 80%;
          margin: 0 auto;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          background: white;
          border: 1px solid var(--color-border-subtle);
        }

        .mock-form-header {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--color-primary);
        }

        .mock-form-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mock-field-row {
          display: flex;
          gap: 14px;
        }

        .mock-field-input {
          height: 42px;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--rounded-default);
          display: flex;
          align-items: center;
          padding-left: 12px;
          font-size: 0.85rem;
          color: var(--color-outline);
          background: var(--color-surface-container-lowest);
        }

        .mock-btn-submit {
          height: 44px;
          background: var(--color-clinical-teal);
          color: white;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Timeline Section */
        .workflow-section {
          padding: 80px 48px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .timeline-wrapper {
          position: relative;
          margin-top: 40px;
        }

        .timeline-line {
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-border-subtle);
          z-index: 1;
        }

        .timeline-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          z-index: 2;
          position: relative;
        }

        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .step-number {
          width: 48px;
          height: 48px;
          border-radius: var(--rounded-full);
          background: white;
          border: 2px solid var(--color-clinical-teal);
          color: var(--color-clinical-teal);
          font-weight: 700;
          font-size: 1.1rem;
          z-index: 5;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
        }

        .step-card {
          padding: 20px;
          text-align: center;
          width: 100%;
        }

        .step-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .step-card p {
          font-size: 0.8rem;
          color: var(--color-on-surface-variant);
          line-height: 1.4;
        }

        /* Features Section */
        .features-section {
          padding: 80px 48px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feature-icon {
          color: var(--color-clinical-teal);
        }

        .feature-card h4 {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .feature-card p {
          font-size: 0.85rem;
          color: var(--color-on-surface-variant);
          line-height: 1.5;
        }

        /* Tech Section */
        .tech-section {
          padding: 80px 48px;
          background: rgba(247, 249, 251, 0.6);
          border-top: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .tech-logo {
          padding: 24px;
          text-align: center;
        }

        .tech-logo h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .tech-logo p {
          font-size: 0.75rem;
          color: var(--color-outline);
          margin-top: 4px;
        }

        /* Impact Section */
        .impact-section {
          padding: 80px 48px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .impact-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .impact-card {
          padding: 32px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .impact-card h3 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-clinical-teal);
        }

        .impact-card h4 {
          font-size: 1rem;
          font-weight: 700;
        }

        .impact-card p {
          font-size: 0.85rem;
          color: var(--color-on-surface-variant);
          line-height: 1.4;
        }

        /* Footer */
        .landing-footer {
          background-color: var(--color-primary);
          color: rgba(255, 255, 255, 0.6);
          padding: 24px;
          text-align: center;
          font-size: 0.8rem;
          margin-top: auto;
        }

        /* Auth Modal */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(9, 20, 38, 0.45);
          backdrop-filter: blur(8px);
          z-index: 2000;
        }

        .modal-card {
          width: 440px;
          background: white;
          padding: 32px;
          border-radius: var(--rounded-lg);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: 12px;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-outline);
        }

        .form-group input {
          height: 44px;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--rounded-default);
          padding: 0 12px;
          font-size: 0.9rem;
          background: var(--color-surface-container-lowest);
          transition: border-color 0.2s ease;
        }

        .form-group input:focus {
          border-color: var(--color-clinical-teal);
        }

        .auth-error-msg {
          color: var(--color-error);
          font-size: 0.8rem;
          font-weight: 500;
        }

        .credentials-tip {
          background: var(--color-surface-container-low);
          border: 1px dashed var(--color-outline-variant);
          padding: 12px;
          border-radius: var(--rounded-default);
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .credentials-tip code {
          background: rgba(0,0,0,0.05);
          padding: 1px 4px;
          border-radius: 2px;
        }

        .btn-modal-cancel {
          background: var(--color-surface-container-high);
          color: var(--color-on-surface-variant);
          padding: 10px 20px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .btn-modal-submit {
          background: var(--color-clinical-teal);
          color: white;
          padding: 10px 24px;
          border-radius: var(--rounded-default);
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2);
        }

        .btn-modal-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Flex alignment utilities */
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .flex-end { display: flex; align-items: center; justify-content: flex-end; }
        .gap-2 { gap: 8px; }

        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 120px 24px 60px;
          }

          .hero-text-content {
            align-items: center;
          }

          .hero-cta-group {
            justify-content: center;
          }

          .problem-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .solution-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .timeline-steps {
            grid-template-columns: repeat(2, 1fr);
          }

          .timeline-line {
            display: none;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tech-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .impact-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .landing-nav {
            padding: 16px 24px;
          }

          .nav-links {
            display: none;
          }

          .hero-main-title {
            font-size: 2.25rem;
          }

          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }

          .cta-button {
            justify-content: center;
            width: 100%;
          }

          .problem-cards-grid {
            grid-template-columns: 1fr;
          }

          .timeline-steps {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .tech-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
