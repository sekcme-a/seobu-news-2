import Footer from "@/components/Footer";
import Header from "./components/Header";

export default function CompanyLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
    </>
  );
}
