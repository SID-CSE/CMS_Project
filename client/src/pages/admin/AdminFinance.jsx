import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest } from "../../services/financeService";

export default function AdminFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(getFinanceState("admin"));

  useEffect(() => {
    setState(getFinanceState("admin"));
  }, []);

  const sync = (nextState) => {
    saveFinanceState("admin", nextState);
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
            onCreateTransaction={(transaction) => sync(createFinanceTransaction("admin", transaction))}
            onUpdateRequest={(requestId, patch) => sync(updateFinanceRequest("admin", requestId, patch))}
            onRecordAction={(transactionId, patch) => sync(recordFinanceAction("admin", transactionId, patch))}
          />
        </div>
      </main>
    </div>
  );
}


