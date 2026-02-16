import React, { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './MainLayout.css';

interface MainLayoutProps {
    children: ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeTab, onTabChange }) => {
    return (
        <div className="main-layout">
            <Navbar activeTab={activeTab} onTabChange={onTabChange} />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
