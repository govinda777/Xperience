import * as React from "react";
import { useAppAuth } from "../../contexts/AuthContext";

// Define a type for our dynamically imported components
type NationComponentType = React.ComponentType<{ userId: string }>;

const Nation = () => {
  const { user } = useAppAuth();
  const [AgentDashboard, setAgentDashboard] = React.useState<NationComponentType | null>(null);
  const [AgentList, setAgentList] = React.useState<NationComponentType | null>(null);

  React.useEffect(() => {
    import("nationfun/AgentDashboard")
      .then(module => setAgentDashboard(() => module.default))
      .catch(err => console.error("Failed to load AgentDashboard", err));

    import("nationfun/AgentList")
      .then(module => setAgentList(() => module.default))
      .catch(err => console.error("Failed to load AgentList", err));
  }, []);

  return (
    <div>
      <h1>Nation Agents</h1>
      {AgentDashboard && user ? <AgentDashboard userId={user.id} /> : <div>Loading Dashboard...</div>}
      <hr />
      <h2>Agent List</h2>
      {AgentList && user ? <AgentList userId={user.id} /> : <div>Loading Agent List...</div>}
    </div>
  );
};

export default Nation;
