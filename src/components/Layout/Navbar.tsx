import React, { useState } from 'react';
import { FileText, LayoutList, Clock, Activity, Mail, Shield, Home, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All Requests');

    const tabs = [
        { name: 'My Request', icon: FileText },
        { name: 'All Requests', icon: LayoutList },
        { name: 'My Pending Actions', icon: Clock },
        { name: 'Active Ex Parts', icon: Activity },
    ];

    return (
        <nav className="glass-navbar">
            <div className="navbar-inner">
                {/* Left: Logo + Site Name + Home */}
                <div className="navbar-left">
                    <img src={logo} alt="Applied Materials" className="navbar-logo" />
                    <span className="navbar-divider"></span>
                    <span className="navbar-site-name">Ex Supplier</span>
                    <span className="navbar-divider"></span>
                    <button className="navbar-icon-btn" title="Home">
                        <Home size={18} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Center: Tab Navigation */}
                <div className="navbar-center">
                    {tabs.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            className={`navbar-tab ${activeTab === name ? 'active' : ''}`}
                            onClick={() => setActiveTab(name)}
                        >
                            <Icon size={16} strokeWidth={2} />
                            <span>{name}</span>
                        </button>
                    ))}
                </div>

                {/* Right: Actions + Profile */}
                <div className="navbar-right">
                    <div className="navbar-actions">
                        <button className="navbar-icon-btn" title="Documentation">
                            <FileText size={18} strokeWidth={1.8} />
                        </button>
                        <button className="navbar-icon-btn" title="Contact">
                            <Mail size={18} strokeWidth={1.8} />
                        </button>
                        <button className="navbar-icon-btn" title="Admin">
                            <Shield size={18} strokeWidth={1.8} />
                        </button>
                    </div>

                    <span className="navbar-divider"></span>

                    <div className="navbar-profile">
                        <div className="navbar-profile-info">
                            <span className="navbar-username">Gaurav Rawat</span>
                            <span className="navbar-role">SAM Approver</span>
                        </div>
                        <div className="navbar-avatar">
                            <span>GR</span>
                        </div>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
