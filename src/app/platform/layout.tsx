import * as React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <header>Header</header>
            {children}
        </div>
    );
};

export default Layout;