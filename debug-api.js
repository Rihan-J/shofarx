async function go() {
  const res = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "hello", email: "test@test.com", message: "long enough message here", service_type: "web" })
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
}
go().catch(console.error);
