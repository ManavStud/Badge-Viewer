import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import "./AllBadgesPage.css";

import { useNavigate } from "react-router-dom";

// Keep image imports for fallback
import img1 from "./img1.png";
import img2 from "./img2.png";
import img3 from "./img3.jpg";
import img4 from "./img4.jpg";
import img5 from "./img5.png";
import img6 from "./img6.png";
import img7 from "./img7.png";
import img8 from "./img8.png";



const difficultyColors = {
  "Easy": "#4CAF50",
  "Medium": "#2196F3",
  "Hard": "#FF9800",
  "Expert": "#9C27B0",
  "Extreme": "#F44336"
};

const AllBadgesPage = () => {
  const [badges, setBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


 
 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [levelsDropdownOpen, setLevelsDropdownOpen] = useState(false);

  
  // Fetch badges from API
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/badges');
        console.log("Fetched badges:", response.data);
        setBadges(response.data.badges);
        setFilteredBadges(response.data.badges);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching badges:", err);
        setError("Failed to load badges. Please try again later.");
        setIsLoading(false);
        
        // Fallback to hardcoded data if API fails
        const fallbackBadges = [
          { 
            id: 1, 
            name: "Cyber Titan Level I", 
            image: img1, 
            difficulty: "Easy", 
            description: "Awarded for completing basic cybersecurity challenges.",
            category: "Fundamentals",
            skillsRequired: ["Basic Security", "Web Awareness"]
          },
          { 
            id: 2, 
            name: "Cyber Warrior", 
            image: img2, 
            difficulty: "Medium", 
            description: "Earned after passing the second level of security defenses.",
            category: "Defense",
            skillsRequired: ["Network Security", "Threat Identification"]
          },
          { 
            id: 3, 
            name: "Cyber Defender", 
            image: img3, 
            difficulty: "Medium", 
            description: "Awarded for identifying and mitigating cyber threats.",
            category: "Defense",
            skillsRequired: ["Threat Prevention", "Security Policy"]
          },
          { 
            id: 4, 
            name: "Cyber Elite", 
            image: img4, 
            difficulty: "Hard", 
            description: "For advanced penetration testing and security analysis.",
            category: "Offensive",
            skillsRequired: ["Penetration Testing", "Vulnerability Assessment"]
          },
          { 
            id: 5, 
            name: "Cyber Guardian", 
            image: img5, 
            difficulty: "Expert", 
            description: "Given to experts in cybersecurity incident response.",
            category: "Defense",
            skillsRequired: ["Incident Response", "Forensic Analysis"]
          },
          { 
            id: 6, 
            name: "Cyber Commander", 
            image: img6, 
            difficulty: "Expert", 
            description: "Achieved by mastering network security and ethical hacking.",
            category: "Leadership",
            skillsRequired: ["Strategic Planning", "Team Leadership"]
          },
          { 
            id: 7, 
            name: "Cyber Legend", 
            image: img7, 
            difficulty: "Extreme", 
            description: "Reserved for elite professionals in cybersecurity.",
            category: "Mastery",
            skillsRequired: ["Advanced Techniques", "Innovative Solutions"]
          },
          { 
            id: 8, 
            name: "Cyber Master", 
            image: img8, 
            difficulty: "Extreme", 
            description: "Top-tier badge awarded for cybersecurity mastery.",
            category: "Mastery",
            skillsRequired: ["Complete Expertise", "Industry Leadership"]
          },
        ];
        setBadges(fallbackBadges);
        setFilteredBadges(fallbackBadges);
      }
    };
    
    fetchBadges();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    if (badges.length === 0) return;
    
    let result = badges;
    
    // Category filter
    if (filter !== "all") {
      result = result.filter(badge => 
        badge.category && badge.category.toLowerCase() === filter.toLowerCase()
      );
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(badge => 
        badge.name.toLowerCase().includes(term) || 
        (badge.description && badge.description.toLowerCase().includes(term)) ||
        (badge.category && badge.category.toLowerCase().includes(term)) ||
        (badge.difficulty && badge.difficulty.toLowerCase().includes(term))
      );
    }
    
    setFilteredBadges(result);
  }, [filter, searchTerm, badges]);
  
  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };
  
  const handleCloseDetails = () => {
    setSelectedBadge(null);
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="badges-page">
        <Navbar />
        <div className="badges-container">
          <h1 className="page-title">Cybersecurity Badges</h1>
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading badges...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if no fallback data
  if (error && badges.length === 0) {
    return (
      <div className="badges-page">
        <Navbar />
        <div className="badges-container">
          <h1 className="page-title">Cybersecurity Badges</h1>
          <div className="error-container glass-card">
            <p className="error-message">{error}</p>
            <button 
              className="glass-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badges-page">
      <Navbar />
      
      <div className="badges-container">
        <h1 className="page-title">Cybersecurity Badges</h1>
        <p className="page-subtitle">
          Complete challenges and earn badges to showcase your cybersecurity skills
        </p>
        
        
          
          
          <div className="badges-filter">
            <span></span>
            <div className="filter-buttons">


              <button 
                className={`filter-button1 ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grid-fill" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
                </svg>
              </button>

              <button 
                className={`filter-button2 ${filter === '' ? 'active' : ''}`}
                onClick={() => navigate("/holo")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-text-fill" viewBox="0 0 16 16">
                  <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1m0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1" />
                </svg>
              </button>

              <button 
                className={`filter-button3 ${filter === '' ? 'active' : ''}`}
                
              >
              

              <div className="dropdown-container">
      {/* Main Dropdown Button */}
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="filter-by">
        Filter by
      </button>

      {/* Main Dropdown Menu */}
      {dropdownOpen && (
        <div className="dropdown-menu">
          {/* Levels Section with Nested Dropdown */}
          <div className="dropdown-item">
            <button onClick={() => setLevelsDropdownOpen(!levelsDropdownOpen)} className="levels">
            Levels
            </button>

            {/* Nested Levels Dropdown */}
            {levelsDropdownOpen && (
              <div className="nested-dropdown">
                <button className="dropdown-item">Amateur</button>
                <button className="dropdown-item">Intermediate</button>
                <button className="dropdown-item">Expert</button>
              </div>
            )}
          </div>

          {/* Courses Section */}
          <button className="dropdown-item">Courses</button>
        </div>
      )}
    </div>

              </button>
            </div>
          </div>
        
        
        {filteredBadges.length === 0 ? (
          <div className="no-badges-found glass-card">
            <p>No badges match your search criteria</p>
            <button 
              className="glass-button"
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="badges-grid">
            {filteredBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="badge-card glass-card"
                onClick={() => handleBadgeClick(badge)}
              >
                <div className="badge-img-container">
                  <img src={badge.image} alt={badge.name} className="badge-img" />
                </div>
                <h3 className="badge-name">{badge.name}</h3>
                <p className="badge-description">{badge.description || `A badge for ${badge.name} achievement.`}</p>
                <div className="badge-meta">
                  <span 
                    className="badge-difficulty"
                    style={{backgroundColor: difficultyColors[badge.difficulty] || difficultyColors.Medium}}
                  >
                    {badge.difficulty || "Medium"}
                  </span>
                  <span className="badge-category">{badge.category || "General"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Link to="/" className="glass-button back-button">
          Back to Home
        </Link>
      </div>
      
      {/* Badge details modal */}
      {selectedBadge && (
        <div className="badge-details-overlay" onClick={handleCloseDetails}>
          <div className="badge-details glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseDetails}>×</button>
            
            <div className="badge-details-header">
              <div className="badge-details-img">
                <img src={selectedBadge.image} alt={selectedBadge.name} />
              </div>
              <div className="badge-details-info">
                <h2>{selectedBadge.name}</h2>
                <div className="badge-details-meta">
                  <span 
                    className="badge-difficulty"
                    style={{backgroundColor: difficultyColors[selectedBadge.difficulty] || difficultyColors.Medium}}
                  >
                    {selectedBadge.difficulty || "Medium"}
                  </span>
                  <span className="badge-category">{selectedBadge.category || "General"}</span>
                </div>
              </div>
            </div>
            
            <div className="badge-details-body">
              <p className="badge-details-description">
                {selectedBadge.description || `A detailed description for the ${selectedBadge.name} badge.`}
              </p>
              
              <div className="badge-details-skills">
                <h3>Skills Required</h3>
                <div className="skills-list">
                  {selectedBadge.skillsRequired && selectedBadge.skillsRequired.length > 0 ? (
                    selectedBadge.skillsRequired.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <>
                      <span className="skill-tag">Cybersecurity</span>
                      <span className="skill-tag">Technical Skills</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="badge-details-actions">
                <button className="glass-button">Get this badge</button>
                <Link to="/learn-more" className="glass-button secondary">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBadgesPage;

