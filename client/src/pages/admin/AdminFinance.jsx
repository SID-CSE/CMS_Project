import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest, getFinanceCycle, closeCycle } from "../../services/financeService";

const EMPTY_STATE = {
  stats: { total_spent: "₹0", pending: "₹0", last_payment: "₹0" },
  transactions: [],
  requests: [],
  expenses: [],
  counterparties: [],
};

export default function AdminFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(EMPTY_STATE);
  const [cycle, setCycle] = useState(null);

  const loadState = async () => {
    const [financeState, cycleData] = await Promise.all([
      getFinanceState("admin"),
      getFinanceCycle("admin"),
    ]);
    setState(financeState || EMPTY_STATE);
    setCycle(cycleData || null);
  };

  useEffect(() => {
    loadState();
  }, []);

  const sync = async (nextState) => {
    await saveFinanceState("admin", nextState);
    setState(nextState);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} notifications={[]}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleFinancePage
            roleLabel="Admin"
            roleKey="admin"
            basePath="/admin"
            state={state}
            counterparties={state.counterparties || []}
            primaryActionLabel="Create Transaction"
            primaryActionHint="Create a payment or invoice between admin and editors/stakeholders."
            cycle={cycle}
            onCreateTransaction={async (transaction) => sync(await createFinanceTransaction("admin", transaction))}
            onUpdateRequest={async (requestId, patch) => sync(await updateFinanceRequest("admin", requestId, patch))}
            onRecordAction={async (transactionId, patch) => sync(await recordFinanceAction("admin", transactionId, patch))}
            onCloseCycle={async (cycleId) => {
              await closeCycle("admin", cycleId);
              await loadState();
            }}
          />
        </div>
      </main>
    </div>
  );
}
