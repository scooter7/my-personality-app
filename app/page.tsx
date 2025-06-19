import QuizClient from "./components/QuizClient";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
          CollegeXpress Personality Survey
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Discover your persona and find colleges that match your style.
        </p>
      </header>
      
      <QuizClient />
      
    </div>
  );
}