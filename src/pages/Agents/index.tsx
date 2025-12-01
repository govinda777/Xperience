import React, { Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";

const AgentDashboard = React.lazy(() => import("nationfun/AgentDashboard"));
const AgentList = React.lazy(() => import("nationfun/AgentList"));

const Agents = () => {
  const { user } = usePrivy();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciador de Agentes</h1>
      <Suspense fallback={<div>Carregando...</div>}>
        <div className="mb-8">
          <AgentDashboard userId={user?.id} theme="light" />
        </div>
        <div>
          <AgentList userId={user?.id} />
        </div>
      </Suspense>
    </div>
  );
};

export default Agents;
