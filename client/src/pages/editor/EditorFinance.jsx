import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest, getFinanceCycle, closeCycle } from "../../services/financeService";

const EMPTY_STATE = {
  stats: { total_spent: "₹0", pending: "₹0", last_payment: "₹0" },
  transactions: [],
  requests: [],
  expenses: [],
  counterparties: [],
};

export default function EditorFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(EMPTY_STATE);
  const [cycle, setCycle] = useState(null);

  const loadState = async () => {
    const [financeState, cycleData] = await Promise.all([
      getFinanceState("editor"),
      getFinanceCycle("editor"),
    ]);
    setState(financeState || EMPTY_STATE);
    setCycle(cycleData || null);
  };

  useEffect(() => {
    loadState();
  }, []);

  const sync = async (nextState) => {
    await saveFinanceState("editor", nextState);
    setState(nextState);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <EditorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <EditorNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen}  />
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? "lg:pl-70" : "lg:pl-0"}`}>
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <RoleFinancePage
            roleLabel="Editor"
            roleKey="editor"
            basePath="/editor"
            state={state}
            counterparties={state.counterparties || []}
            primaryActionLabel="Request Payout"
            primaryActionHint="Request a payout from admin for completed editorial work."
            cycle={cycle}
            onCreateTransaction={async (transaction) => sync(await createFinanceTransaction("editor", transaction))}
            onUpdateRequest={async (requestId, patch) => sync(await updateFinanceRequest("editor", requestId, patch))}
            onRecordAction={async (transactionId, patch) => sync(await recordFinanceAction("editor", transactionId, patch))}
            onCloseCycle={async (cycleId) => {
              await closeCycle("editor", cycleId);
              await loadState();
            }}
            allowCreate={false}
          />
        </div>
      </main>
    </div>
  );
}
