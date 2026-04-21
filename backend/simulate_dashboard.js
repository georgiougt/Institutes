async function checkDashboard() {
  const instituteId = '56002a61-bfb2-41ae-a14d-2fd5bfee19ab'; // Georgia
  const userId = '8a42722e-1bc3-4928-ad67-b7c92aac1110'; // Georgia Owner
  
  try {
    const res = await fetch(`http://localhost:3001/api/v1/owner/institutes/${instituteId}/metrics`, {
      headers: { 'X-User-Id': userId }
    });
    const data = await res.json();
    console.log('Metrics from Dashboard API:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err.message);
  }
}

checkDashboard();
