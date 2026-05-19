const API_BASE_URL = "http://localhost:8080/api";

export async function login(username, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return await res.text();
}

export async function subscriberLogin(msisdn, password) {
  const res = await fetch(`${API_BASE_URL}/subscriber-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ msisdn, password }),
  });

  return await res.json();
}

export async function buyService(subscriberId, serviceId) {
  const res = await fetch(`${API_BASE_URL}/buy-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriberId, serviceId }),
  });

  return await res.text();
}

export async function cancelSubscription(subscriberId, serviceId) {
  const res = await fetch(`${API_BASE_URL}/cancel-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subscriberId, serviceId }),
  });

  return await res.text();
}

export async function getTopServices() {
  const res = await fetch(`${API_BASE_URL}/reports/top-services`);
  return await res.json();
}

export async function getActiveSubscriptions() {
  const res = await fetch(`${API_BASE_URL}/reports/active-subscriptions`);
  return await res.json();
}

export async function getRevenue() {
  const res = await fetch(`${API_BASE_URL}/reports/revenue`);
  return await res.json();
}

export async function getServices() {
  const res = await fetch(`${API_BASE_URL}/services`);
  return await res.json();
}

export async function getSubscriber(id) {
  const res = await fetch(`${API_BASE_URL}/subscriber/${id}`);
  return await res.json();
}

export async function getLogs() {
  const res = await fetch(`${API_BASE_URL}/reports/logs`);
  return await res.json();
}

export async function getRevenueSummary() {
  const res = await fetch(
    `${API_BASE_URL}/reports/revenue-summary`
  );

  return await res.json();
}

export async function getBusinessDaysPerformance(
  startDate,
  endDate
) {

  const res = await fetch(
    `${API_BASE_URL}/reports/business-days-performance?startDate=${startDate}&endDate=${endDate}`
  );

  return await res.json();
}
export async function getSubscriberSpending(id) {
  const res = await fetch(`${API_BASE_URL}/reports/subscriber-spending/${id}`);
  return await res.json();
}
export async function getSubscriberSubscriptions(id) {
  const res = await fetch(
    `${API_BASE_URL}/reports/subscriber-subscriptions/${id}`
  );

  return await res.json();
}