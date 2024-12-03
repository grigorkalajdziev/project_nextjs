import { useEffect } from "react";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  useEffect(() => {    
    router.push("/home/trending");
  }, [router]);

  return null;
};

export default Index;