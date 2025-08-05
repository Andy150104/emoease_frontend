// File: src/components/BaseScreen.tsx
import React, { ReactNode, FC } from 'react';
import Navigationbar from 'EmoEase/components/Navbar/Navigationbar';
import Footer from 'EmoEase/components/Footer/Footer';
import ScrollSmootherWrapper from 'EmoEase/components/Animation/ScrollingTriggerComponent';

interface BaseScreenProps {
  children: ReactNode;
}

const BaseScreen: FC<BaseScreenProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigationbar />
      <ScrollSmootherWrapper>
        <div id="smooth-wrapper" className="overflow-hidden">
          <div id="smooth-content">
      {/* HEADER */}

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-24">
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

export default BaseScreen;
