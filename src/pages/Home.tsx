import Courses from "@/components/homeComponents/Courses";
import Header from "@/components/homeComponents/Header";
import QuizSteps from "@/components/homeComponents/QuizSteps";
import StudentTestimonials from "@/components/homeComponents/StudentTestimonials";
import TrendingCourses from "@/components/homeComponents/TrendingCourses";
import WhyUs from "@/components/homeComponents/WhyUs";

export default function Home() {
  return (
    <section className="flex flex-col w-screen h-full">
      <Header />
      <QuizSteps />
      <TrendingCourses />
      <WhyUs />
      <Courses />
      <StudentTestimonials />
    </section>
  );
}
