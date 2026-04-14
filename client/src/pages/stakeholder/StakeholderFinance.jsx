import React, { useEffect, useState } from "react";
import StakeholderNavbar from "../../components/Navbar/StakeholderNavbar";
import StakeholderSidebar from "../../components/Sidebar/StakeholderSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest } from "../../services/financeService";

const EMPTY_STATE = {
  stats: { total_spent: "₹0", pending: "₹0", last_payment: "₹0" },
  transactions: [],
  requests: [],
  expenses: [],
  counterparties: [],
};

export default function StakeholderFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(EMPTY_STATE);

  const loadState = async () => {
    const next = await getFinanceState("stakeholder");
    setState(next || EMPTY_STATE);
  };

  useEffect(() => {
    loadState();
  }, []);

  const sync = async (nextState) => {
    await saveFinanceState("stakeholder", nextState);
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
            onCreateTransaction={async (transaction) => sync(await createFinanceTransaction("stakeholder", transaction))}
            onUpdateRequest={async (requestId, patch) => sync(await updateFinanceRequest("stakeholder", requestId, patch))}
            onRecordAction={async (transactionId, patch) => sync(await recordFinanceAction("stakeholder", transactionId, patch))}
            allowCreate={false}
          />
        </div>
      </main>
    </div>
  );
}


