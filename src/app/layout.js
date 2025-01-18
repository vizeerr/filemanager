import TopNavbar from "@/components/TopNavbar";
import "./globals.css";
import { Tangerine,Josefin_Sans } from 'next/font/google'
import { Toaster } from "react-hot-toast";

export const tangerine = Tangerine({
  subsets: ['latin'],
  display: 'swap',
  weight:['400','700'],
  variable:'--font-tang'
})

export const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight:['100','200','300','400','500','600','700'],
  variable:'--font-josef'
})

export const metadata = {
  title: "Sagar Drop",
  description: "An Art Written By Vivek Sagar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">      
      <body>
        {/* <TopNavbar/> */}
        <Toaster
          position="bottom-center"
          reverseOrder={false}
        />
        {children}
      </body>    
    </html>
  );
}
