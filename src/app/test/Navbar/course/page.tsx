"use client";
import React from "react";
import teacherPNG from "EmoEase/assets/teacher.png";
import CourseCard from "EmoEase/components/CourseCard/CourseCard";

const CourseCardPage = ({}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* Example CourseCard support to buy or choose */}
      <CourseCard
        imageUrl={teacherPNG}
        title="Lập trình với Spring Framework"
        descriptionLines={[
          "Basic concepts of Java FX to build Desktop Application",
          "Basics of Object Relational Mapping (ORM) with JPA",
        ]}
        instructor="Nguyễn Văn A"
        price="199.000 VND"
        routerPush="/test/Navbar/home"
      />

      {/* Example CourseCard with progress */}
      <div className="ml-72">
        <CourseCard
          imageUrl={teacherPNG}
          title="HTML & CSS Foundation"
          instructor="Lina"
          instructorAvatar={teacherPNG}
          isShowProgress
          progress={70}
          currentLesson={5}
          totalLessons={7}
          routerPush="/test/Navbar/home"
        />
      </div>
    </div>
  );
};

export default CourseCardPage;
