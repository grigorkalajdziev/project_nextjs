import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Unsubscribe() {
  const router = useRouter();
  const { email } = router.query;

  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    if (!email) return;

    fetch(`/api/unsubscribe?email=${email}`)
      .then(() => setStatus("You have been unsubscribed successfully."))
      .catch(() => setStatus("Error unsubscribing."));
  }, [email]);

  return (
    <div style={{ textAlign: "center", marginTop: "120px", fontFamily: "Arial" }}>
      <h2>{status}</h2>
    </div>
  );
}