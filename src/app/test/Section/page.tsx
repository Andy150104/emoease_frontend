// File: src/pages/MyPage.tsx
"use client";
import SectionCollapse, {
  Section,
} from "EmoEase/components/Section/SectionCollapse";
import React from "react";

const sections: Section[] = [
  {
    key: "1",
    title: "Section 2: Basics & Core Concepts - DOM Interaction with Vue",
    completed: 11,
    total: 31,
    duration: "2hr 9min",
    items: [
      { key: "15", title: "Module Introduction", done: true, duration: "1min" },
      {
        key: "16",
        title: "Important: Changed Vue Script Import Path",
        done: true,
        duration: "1min",
      },
      {
        key: "17",
        title: "Creating and Connecting Vue App Instances",
        done: true,
        duration: "9min",
        resources: [
          {
            name: "gs-01-starting-project.zip",
            url: "/files/gs-01-starting-project.zip",
          },
          { name: "Slides.zip", url: "/files/Slides.zip" },
        ],
      },
      {
        key: "18",
        title: "Important: Changed Vue Script Import Path",
        done: false,
        duration: "1min",
      },
      // … tiếp
    ],
  },
  {
    key: "2",
    title: "Section 2: Basics & Core Concepts - DOM Interaction with Vue",
    completed: 11,
    total: 31,
    duration: "2hr 9min",
    items: [
      { key: "15", title: "Module Introduction", done: true, duration: "1min" },
      {
        key: "16",
        title: "Important: Changed Vue Script Import Path",
        done: true,
        duration: "1min",
      },
      {
        key: "17",
        title: "Creating and Connecting Vue App Instances",
        done: true,
        duration: "9min",
        resources: [
          {
            name: "gs-01-starting-project.zip",
            url: "/files/gs-01-starting-project.zip",
          },
          { name: "Slides.zip", url: "/files/Slides.zip" },
        ],
      },
      {
        key: "18",
        title: "Important: Changed Vue Script Import Path",
        done: false,
        duration: "1min",
      },
      // … tiếp
    ],
  },
  {
    key: "3",
    title: "Section 2: Basics & Core Concepts - DOM Interaction with Vue",
    completed: 11,
    total: 31,
    duration: "2hr 9min",
    items: [
      { key: "15", title: "Module Introduction", done: true, duration: "1min" },
      {
        key: "16",
        title: "Important: Changed Vue Script Import Path",
        done: true,
        duration: "1min",
      },
      {
        key: "17",
        title: "Creating and Connecting Vue App Instances",
        done: true,
        duration: "9min",
        resources: [
          {
            name: "gs-01-starting-project.zip",
            url: "/files/gs-01-starting-project.zip",
          },
          { name: "Slides.zip", url: "/files/Slides.zip" },
        ],
      },
      {
        key: "18",
        title: "Important: Changed Vue Script Import Path",
        done: false,
        duration: "1min",
      },
      // … tiếp
    ],
  },
];

const MyPage: React.FC = () => (
  <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
    <SectionCollapse sections={sections} defaultOpenKey="1" />
  </div>
);

export default MyPage;
