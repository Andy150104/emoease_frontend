// File: src/components/BaseScreen.tsx
import React, { ReactNode, FC } from 'react';
import Footer from 'EmoEase/components/Footer/Footer';
import ScrollSmootherWrapper from 'EmoEase/components/Animation/ScrollingTriggerComponent';
import NavigationbarWhite from 'EmoEase/components/Navbar/NavigationbarWhite';

interface BaseScreenProps {
  children: ReactNode;
}

const BaseScreenWhiteNav: FC<BaseScreenProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationbarWhite />
      <ScrollSmootherWrapper>
        <div id="smooth-wrapper" className="overflow-hidden">
          <div id="smooth-content">
      {/* HEADER */}

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24 bg-white dark:bg-gray-900">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
          </div>
        </div>
      </ScrollSmootherWrapper>
    </div>
  );
};

export default BaseScreenWhiteNav;
