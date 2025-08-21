"use client";
import React from "react";
import ResultScreen from "./Client";

export default function SuccessScreen() {
  return (
    <>
      <ResultScreen
        type="success"
        title="SUCCESS"
        description="Thank you for your request. We are working hard to find the best services and deals for you. Shortly you will find a confirmation in your email."
        onContinue={() => console.log("Go next page")}
      />
      <ResultScreen
        type="error"
        title="ERROR"
        description="Something went wrong while processing your request. Please try again later."
        onContinue={() => console.log("Retry")}
      />
    </>
  );
}
