import React, { useState } from 'react';
import { Shield, Mail, FileText, ChevronDown, Home } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All Requests');

    const tabs = [
        'My Request',
        'All Requests',
        'My Pending Actions',
        'Active Ex Parts'
    ];

    return (
        <nav className="amat-navbar">
            <div className="navbar-container">
                {/* Left Section: Logo & Brand Area */}
                <div className="navbar-left">
                    <div className="brand-area">
                        <img src={logo} alt="AMAT Logo" className="brand-logo" />
                        <span className="divider-vertical"></span>
                        <span className="brand-text">Ex Supplier</span>
                        <span className="divider-vertical"></span>
                        <button className="home-btn" title="Home">
                            <Home size={20} />
                        </button>
                    </div>
                </div>

                {/* Center Section: Folder-style Tabs */}
                <div className="navbar-center">
                    <div className="nav-tabs-container">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`nav-folder-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Section: Actions & Profile */}
                <div className="navbar-right">
                    <div className="global-actions">
                        <button className="icon-action-btn" title="Documentation">
                            <FileText size={18} />
                            <span className="action-label">Docs</span>
                        </button>
                        <button className="icon-action-btn" title="Contact">
                            <Mail size={18} />
                            <span className="action-label">Contact</span>
                        </button>
                        <button className="icon-action-btn" title="Admin">
                            <Shield size={18} />
                            <span className="action-label">Admin</span>
                        </button>
                    </div>

                    <span className="divider-vertical light"></span>

                    <div className="profile-section">
                        <div className="profile-details">
                            <span className="profile-name">Gaurav Rawat</span>
                            <span className="profile-role">SAM Approver</span>
                        </div>
                        <div className="profile-avatar-circle">
                            <span>GR</span>
                        </div>
                        <ChevronDown size={14} className="dropdown-caret" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
