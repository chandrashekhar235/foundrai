import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Workflow from "../components/Workflow/Workflow";
 
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Workflow />
    </>
  );
}