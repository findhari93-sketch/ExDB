import React, { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';
import { FileText, LayoutList, Clock, Activity, Mail, Shield, Home, ChevronDown } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Navbar.css';

interface NavbarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { name: 'My Request', icon: FileText },
    { name: 'All Requests', icon: LayoutList },
    { name: 'My Pending Actions', icon: Clock },
    { name: 'Active Ex Parts', icon: Activity },
];

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
    const centerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

    const updatePill = useCallback(() => {
        const activeIndex = tabs.findIndex(t => t.name === activeTab);
        const el = tabRefs.current[activeIndex];
        const container = centerRef.current;
        if (el && container) {
            const cRect = container.getBoundingClientRect();
            const tRect = el.getBoundingClientRect();
            setPill({ left: tRect.left - cRect.left, width: tRect.width });
        }
    }, [activeTab]);

    useLayoutEffect(() => { updatePill(); }, [updatePill]);
    useEffect(() => {
        window.addEventListener('resize', updatePill);
        return () => window.removeEventListener('resize', updatePill);
    }, [updatePill]);

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
                <div className="navbar-center" ref={centerRef}>
                    {pill && (
                        <div
                            className="navbar-tab-pill"
                            style={{ left: pill.left, width: pill.width }}
                        />
                    )}
                    {tabs.map(({ name, icon: Icon }, index) => (
                        <button
                            key={name}
                            ref={(el) => { tabRefs.current[index] = el; }}
                            className={`navbar-tab ${activeTab === name ? 'active' : ''}`}
                            onClick={() => onTabChange(name)}
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
