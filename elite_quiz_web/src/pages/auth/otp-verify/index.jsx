import dynamic from "next/dynamic";
import Meta from "@/components/SEO/Meta";
const OtpVerify = dynamic(() => import("@/components/auth/OtpVerify"), {
  ssr: false,
});

const Index = () => {
  return (
    <>
      <Meta />
      <OtpVerify />
    </>
  );
};

export default Index;
