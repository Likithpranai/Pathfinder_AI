import React from 'react';
import { StyleSheet } from 'react-native';

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Option {
  id: string;
  text: string;
  type?: string; // Optional field to categorize options (e.g., "tech", "science", "art", etc.)
}

export const onboardingQuestions: Question[] = [
  {
    id: 1,
    text: "Your school is hosting a tech fair, and you get to lead a booth to showcase anything that interests you. What would you showcase?",
    options: [
      { id: '1a', text: "A phone app to help students track homework", type: "tech" },
      { id: '1b', text: "A 3D-printed solar-powered car you designed", type: "engineering" },
      { id: '1c', text: "A science experiment showing how bacteria grow in different conditions", type: "science" },
      { id: '1d', text: "A mini-business selling custom DIY items created by you", type: "business" },
      { id: '1e', text: "A short blog you made about your life outside of school", type: "creative" },
      { id: '1f', text: "Promote a volunteering program organized to help nearby orphanages out", type: "social" },
    ]
  },
  {
    id: 2,
    text: "Given that your school has multiple problems, you are asked to choose a problem you want to help fix. Which of the following would you prefer to help with?",
    options: [
      { id: '2a', text: "Create a website to streamline ticket sales and event updates", type: "tech" },
      { id: '2b', text: "Construct a sturdy stage setup using tools and materials", type: "engineering" },
      { id: '2c', text: "Research why the event's food spoiled and suggest solutions", type: "science" },
      { id: '2d', text: "Create a marketing plan to boost attendance and raise funds", type: "business" },
      { id: '2e', text: "Design eye-catching posters and a theme song for the upcoming event", type: "creative" },
      { id: '2f', text: "Set up a support booth to help attendees feel welcome and safe", type: "social" },
    ]
  },
  {
    id: 3,
    text: "You win a scholarship to join a summer program. Which one do you pick?",
    options: [
      { id: '3a', text: "Coding bootcamp to build your own video games", type: "tech" },
      { id: '3b', text: "Workshop to design and test small bridges or robots", type: "engineering" },
      { id: '3c', text: "Lab program to study renewable energy", type: "science" },
      { id: '3d', text: "Entrepreneurship camp to pitch startup idea to investors", type: "business" },
      { id: '3e', text: "Art camp to create a portfolio of drawings or music", type: "creative" },
      { id: '3f', text: "Volunteer program to teach kids or help at a community center", type: "social" },
    ]
  },
  {
    id: 4,
    text: "Your town is hosting a festival, and you're on the planning team. What's your contribution?",
    options: [
      { id: '4a', text: "A digital map app to help visitors navigate the festival", type: "tech" },
      { id: '4b', text: "A custom-built photo booth with cool mechanical features", type: "engineering" },
      { id: '4c', text: "A display explaining the environmental impact of the festival", type: "science" },
      { id: '4d', text: "A plan to sell tickets and manage the festival's budget", type: "business" },
      { id: '4e', text: "A live performance or colorful banners to decorate the event", type: "creative" },
      { id: '4f', text: "A booth to connect visitors with local charities or resources", type: "social" },
    ]
  },
  {
    id: 5,
    text: "You're given $500 to start a small project. What do you do with it?",
    options: [
      { id: '5a', text: "Buy software to create a study app for your classmates", type: "tech" },
      { id: '5b', text: "Get materials to build a model wind turbine or gadget", type: "engineering" },
      { id: '5c', text: "Purchase lab supplies to test air quality in your town", type: "science" },
      { id: '5d', text: "Start a small online store selling custom phone cases", type: "business" },
      { id: '5e', text: "Invest in art supplies to create a comic book or music video", type: "creative" },
      { id: '5f', text: "Fund a community garden or donation drive for families in need", type: "social" },
    ]
  },
  {
    id: 6,
    text: "Your school's social media page needs a boost. What content do you create?",
    options: [
      { id: '6a', text: "A fun quiz app to engage students online", type: "tech" },
      { id: '6b', text: "A time-lapse video of building a new school feature, like a bench", type: "engineering" },
      { id: '6c', text: "Infographics about local wildlife or energy-saving tips", type: "science" },
      { id: '6d', text: "A campaign to promote school merch and raise funds", type: "business" },
      { id: '6e', text: "A series of short skits or artwork showcasing school spirit", type: "creative" },
      { id: '6f', text: "Stories highlighting students helping the community", type: "social" },
    ]
  },
  {
    id: 7,
    text: "You're asked to lead a group project for a national contest. What's your idea?",
    options: [
      { id: '7a', text: "An AI chatbot to answer students' homework questions", type: "tech" },
      { id: '7b', text: "A prototype for a foldable bike that's easy to store", type: "engineering" },
      { id: '7c', text: "A study on how screen time affects sleep patterns", type: "science" },
      { id: '7d', text: "A business plan for a teen-run delivery service", type: "business" },
      { id: '7e', text: "A short film or song about a social issue you care about", type: "creative" },
      { id: '7f', text: "A program to mentor younger kids in your school", type: "social" },
    ]
  },
  {
    id: 8,
    text: "You get to shadow a professional for a day. Who do you choose?",
    options: [
      { id: '8a', text: "A coder working on a new gaming app", type: "tech" },
      { id: '8b', text: "An engineer designing eco-friendly buildings", type: "engineering" },
      { id: '8c', text: "A scientist researching climate change solutions", type: "science" },
      { id: '8d', text: "A startup founder pitching to investors", type: "business" },
      { id: '8e', text: "A graphic designer or musician creating new content", type: "creative" },
      { id: '8f', text: "A teacher or counselor helping students succeed", type: "social" },
    ]
  },
  {
    id: 9,
    text: "Your community needs help after a storm. How do you contribute?",
    options: [
      { id: '9a', text: "Create a website to share updates and connect volunteers", type: "tech" },
      { id: '9b', text: "Help rebuild damaged structures, like fences or shelters", type: "engineering" },
      { id: '9c', text: "Test water samples to ensure they're safe for drinking", type: "science" },
      { id: '9d', text: "Organize a fundraiser to support affected families", type: "business" },
      { id: '9e', text: "Design flyers or record a video to raise awareness", type: "creative" },
      { id: '9f', text: "Volunteer to distribute supplies or comfort residents", type: "social" },
    ]
  }
];

// Helper function to get a specific question by ID
export const getQuestionById = (id: number): Question | undefined => {
  return onboardingQuestions.find(question => question.id === id);
};

// Helper function to get all questions
export const getAllQuestions = (): Question[] => {
  return onboardingQuestions;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});

export default {
  onboardingQuestions,
  getQuestionById,
  getAllQuestions,
};
