import React, { useEffect, useState } from "react";
import EditorNavbar from "../../components/Navbar/EditorNavbar";
import EditorSidebar from "../../components/Sidebar/EditorSidebar";
import RoleFinancePage from "../../components/finance/RoleFinancePage";
import { createFinanceTransaction, getFinanceState, recordFinanceAction, saveFinanceState, updateFinanceRequest } from "../../services/financeService";

export default function EditorFinance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [state, setState] = useState(getFinanceState("editor"));

  useEffect(() => {
    setState(getFinanceState("editor"));
  }, []);

  const sync = (nextState) => {
    saveFinanceState("editor", nextState);
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
            onCreateTransaction={(transaction) => sync(createFinanceTransaction("editor", transaction))}
            onUpdateRequest={(requestId, patch) => sync(updateFinanceRequest("editor", requestId, patch))}
            onRecordAction={(transactionId, patch) => sync(recordFinanceAction("editor", transactionId, patch))}
          />
        </div>
      </main>
    </div>
  );
}


