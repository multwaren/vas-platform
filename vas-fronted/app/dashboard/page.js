"use client";

import { useEffect, useState } from "react";
import {
  getTopServices,
  getActiveSubscriptions,
  getRevenue,
  getServices,
  buyService,
  cancelSubscription,
  getSubscriber,
  getLogs,
  getRevenueSummary,
  getBusinessDaysPerformance,
  getSubscriberSpending,
  getSubscriberSubscriptions,
} from "../../lib/api";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("services");

  const [topServices, setTopServices] = useState([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [subscriber, setSubscriber] = useState(null);
  const [logs, setLogs] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState({});
  const [businessPerformance, setBusinessPerformance] = useState({});
  const [userSpending, setUserSpending] = useState(0);
  const [mySubscriptions, setMySubscriptions] = useState([]);

  async function loadReports() {
    const top = await getTopServices();
    const active = await getActiveSubscriptions();
    const revenueData = await getRevenue();
    const serviceList = await getServices();
    const logsData = await getLogs();
    const revenueSummaryData = await getRevenueSummary();

    const businessData = await getBusinessDaysPerformance(
      "2026-05-01",
      "2026-05-31"
    );

    setTopServices(top);
    setActiveSubscriptions(active.ACTIVE_SUBSCRIPTIONS);
    setRevenue(revenueData.TOTAL_REVENUE);
    setServices(serviceList);
    setLogs(logsData);
    setRevenueSummary(revenueSummaryData);
    setBusinessPerformance(businessData);
  }

  async function refreshSubscriber(subscriberId) {
    const updatedSubscriber = await getSubscriber(subscriberId);
    setSubscriber(updatedSubscriber);
    localStorage.setItem("subscriber", JSON.stringify(updatedSubscriber));
  }

  async function refreshUserSpending(subscriberId) {
    const spendingData = await getSubscriberSpending(subscriberId);
    setUserSpending(spendingData.USER_SPENDING);
  }

  async function refreshMySubscriptions(subscriberId) {
    const data = await getSubscriberSubscriptions(subscriberId);
    setMySubscriptions(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    const storedSubscriber = JSON.parse(localStorage.getItem("subscriber"));
    setSubscriber(storedSubscriber);

    if (storedSubscriber) {
      refreshUserSpending(storedSubscriber.SUBSCRIBER_ID);
      refreshMySubscriptions(storedSubscriber.SUBSCRIBER_ID);
    }

    loadReports();
  }, []);

  async function handleBuy(serviceId) {
    if (!subscriber) return;

    const subscriberId = subscriber.SUBSCRIBER_ID;
    const result = await buyService(subscriberId, serviceId);

    if (typeof result === "string" && result.includes("error")) {
      setMessage("Service purchase failed.");
    } else {
      setMessage("Service purchased successfully.");
    }

    await refreshSubscriber(subscriberId);
    await refreshUserSpending(subscriberId);
    await refreshMySubscriptions(subscriberId);
    await loadReports();
  }

  async function handleCancel(serviceId) {
    if (!subscriber) return;

    const subscriberId = subscriber.SUBSCRIBER_ID;
    const result = await cancelSubscription(subscriberId, serviceId);

    if (typeof result === "string" && result.includes("error")) {
      setMessage("Subscription could not be cancelled.");
    } else {
      setMessage("Subscription cancelled successfully.");
    }

    await refreshSubscriber(subscriberId);
    await refreshUserSpending(subscriberId);
    await refreshMySubscriptions(subscriberId);
    await loadReports();
  }

  const tabs = [
    { id: "services", label: "Services" },
    { id: "subscriptions", label: "My Subscriptions" },
    { id: "analytics", label: "Analytics" },
    { id: "logs", label: "Logs" },
    { id: "top", label: "Top Services" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-red-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-red-700">
              Vodafone Telsim Dashboard
            </h1>
            <p className="text-gray-700 mt-2">
              VAS service management and subscriber operations
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-white text-red-700 border border-red-200 px-5 py-2 rounded-xl font-semibold shadow hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        {subscriber && (
          <div className="mb-6 bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">
                  Logged in subscriber
                </p>

                <p className="text-3xl font-extrabold text-gray-950 mt-2">
                  {subscriber.FULL_NAME}
                </p>

                <p className="text-gray-700 mt-1 font-medium">
                  Subscriber ID: {subscriber.SUBSCRIBER_ID}
                </p>

                <div className="flex gap-8 mt-5">
                

                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Spending
                    </p>
                    <p className="text-2xl font-extrabold text-gray-950">
                      {userSpending || 0} TL
                    </p>
                  </div>

                  
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 text-right">
                <p className="text-sm text-gray-700 font-semibold">
                  Current Balance
                </p>
                <p className="text-3xl font-extrabold text-red-700">
                  {subscriber.BALANCE} TL
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-3 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 rounded-2xl font-bold transition ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-red-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className="mb-6 bg-white p-5 rounded-2xl shadow-lg border border-gray-200 text-lg font-bold text-gray-900">
            {message}
          </div>
        )}

        {activeTab === "services" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-5">
              Available Services
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <div
  key={service.SERVICE_ID}
  className="border border-gray-200 rounded-2xl p-5 shadow hover:shadow-xl transition bg-gray-50 flex flex-col justify-between min-h-[260px]"
>
  <div>

    <p className="text-lg font-extrabold text-gray-950">
      {service.SERVICE_NAME}
    </p>

    <p className="text-sm font-bold text-red-600 mt-2">
      {service.SERVICE_TYPE}
    </p>

    <p className="text-3xl font-extrabold text-gray-950 mt-3">
      {service.PRICE} TL
    </p>

  </div>

  <div className="mt-4">

    <button
      onClick={() => handleBuy(service.SERVICE_ID)}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold"
    >
      Buy
    </button>

    {service.SERVICE_TYPE === "SUBSCRIPTION" && (
      <button
        onClick={() => handleCancel(service.SERVICE_ID)}
        className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold"
      >
        Cancel
      </button>
    )}

  </div>
</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-5">
              My Active Subscriptions
            </h2>

            {mySubscriptions.length === 0 ? (
              <p className="text-gray-600 font-medium">
                No active subscription found.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mySubscriptions.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-5"
                  >
                    <p className="text-xl font-extrabold text-gray-950">
                      {service.SERVICE_NAME}
                    </p>

                    <p className="text-red-600 font-bold mt-2">
                      {service.SERVICE_TYPE}
                    </p>

                    <p className="text-2xl font-extrabold text-gray-950 mt-4">
                      {service.PRICE} TL
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-5">
              Revenue Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
    <p className="text-gray-600 font-semibold">
      Total Active Subscriptions
    </p>

    <p className="text-3xl font-extrabold text-gray-950 mt-2">
      {activeSubscriptions}
    </p>
  </div>

  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
    <p className="text-gray-600 font-semibold">
      User Spending
    </p>

    <p className="text-3xl font-extrabold text-gray-950 mt-2">
      {userSpending || 0} TL
    </p>
  </div>

  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
    <p className="text-gray-600 font-semibold">
      Top Service
    </p>

    <p className="text-2xl font-extrabold text-gray-950 mt-2">
      {topServices[0]?.SERVICE_NAME || "-"}
    </p>
  </div>

</div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-700 font-semibold">Last 24 Hours</p>
                <p className="text-3xl font-extrabold text-red-700 mt-2">
                  {revenueSummary.LAST_24_HOURS || 0} TL
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-700 font-semibold">Last 7 Days</p>
                <p className="text-3xl font-extrabold text-red-700 mt-2">
                  {revenueSummary.LAST_7_DAYS || 0} TL
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <p className="text-gray-700 font-semibold">Last 30 Days</p>
                <p className="text-3xl font-extrabold text-red-700 mt-2">
                  {revenueSummary.LAST_30_DAYS || 0} TL
                </p>
              </div>
            </div>

            <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5">
              <h3 className="text-xl font-extrabold text-gray-950 mb-4">
                Business Days Performance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700 font-semibold">Total Sales</p>
                  <p className="text-3xl font-extrabold text-red-700 mt-2">
                    {businessPerformance.TOTAL_SALES || 0}
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 font-semibold">Total Revenue</p>
                  <p className="text-3xl font-extrabold text-red-700 mt-2">
                    {businessPerformance.TOTAL_REVENUE || 0} TL
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-5">
              Transaction Logs
            </h2>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.LOG_ID}
                  className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-red-700">
                      {log.ACTION_TYPE}
                    </span>

                    <span className="text-gray-700">
                      Subscriber #{log.SUBSCRIBER_ID}
                    </span>

                    <span className="text-gray-700">
                      Service #{log.SERVICE_ID}
                    </span>
                  </div>

                  <span className="text-gray-500 text-xs">
                    {log.CREATED_AT}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "top" && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <h2 className="text-2xl font-extrabold text-gray-950 mb-5">
              Top Services
            </h2>

            <table className="w-full overflow-hidden">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 text-gray-800 font-bold">
                    Service Name
                  </th>
                  <th className="text-left p-4 text-gray-800 font-bold">
                    Total Sales
                  </th>
                </tr>
              </thead>

              <tbody>
                {topServices.map((service, index) => (
                  <tr key={index} className="border-b hover:bg-red-50">
                    <td className="p-4 text-gray-900 font-semibold">
                      {service.SERVICE_NAME}
                    </td>
                    <td className="p-4 text-gray-900 font-semibold">
                      {service.TOTAL_SALES}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}