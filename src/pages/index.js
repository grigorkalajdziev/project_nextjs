// pages/index.js
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/home/trending",
      permanent: true, // 308 redirect (good for SEO)
    },
  };
}

export default function Index() {
  return null;
}
