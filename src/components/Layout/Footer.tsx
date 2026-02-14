import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="amat-footer">
            <div className="footer-content">
                <p>&copy; {currentYear} Applied Materials, Inc. All rights reserved.</p>
                <span className="divider">|</span>
                <p className="confidential">Applied Materials Confidential - Internal Use Only</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Use</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
