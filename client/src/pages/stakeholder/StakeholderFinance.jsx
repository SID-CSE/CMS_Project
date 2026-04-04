import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest } from "../../services/financeService";

export default function StakeholderFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(getFinanceState("stakeholder"));

  useEffect(() => {
    setState(getFinanceState("stakeholder"));
  }, []);

  const sync = (nextState) => {
    saveFinanceState("stakeholder", nextState);
    setState(nextState);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <StakeholderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <StakeholderNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleFinancePage
            roleLabel="Stakeholder"
            roleKey="stakeholder"
            basePath="/stakeholder"
            state={state}
            counterparties={state.counterparties || []}
            primaryActionLabel="Pay Request"
            primaryActionHint="Pay admin requests directly or record a direct payment for approval."
            onCreateTransaction={(transaction) => sync(createFinanceTransaction("stakeholder", transaction))}
            onUpdateRequest={(requestId, patch) => sync(updateFinanceRequest("stakeholder", requestId, patch))}
            onRecordAction={(transactionId, patch) => sync(recordFinanceAction("stakeholder", transactionId, patch))}
          />
        </div>
      </main>
    </div>
  );
}


