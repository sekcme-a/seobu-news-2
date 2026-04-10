import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata = {
  title: "월세 관리 시스템",
  description: "부동산 월세 관리 대시보드",
};

export default function RootLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="flex-1 ml-64 p-8 min-h-screen"
        style={{ background: "var(--bg)" }}
      >
        {children}
      </main>
    </div>
  );
}
