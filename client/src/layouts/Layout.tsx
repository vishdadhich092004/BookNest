import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer/Footer";

type Props = {
  children: React.ReactNode;
};
function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen font-irina">
      <Header />
      <main className="flex-grow container mx-auto py-10 font-roboto">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
