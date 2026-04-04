import "./Layer2Console.css";
import { buildActionProposal } from "../layer2/ActionProposal";
import { validateStructure } from "../layer2/StructuralValidator";
import { simulateGovernance } from "../layer2/GovernanceHandshake";

export default function Layer2Console() {

  const input = {
    actor: "intent-router",
    action: "weather.fetch",
    agents: ["weather.agent"],
    context: { city: "Mumbai" }
  };

  const validation = validateStructure(input.agents);

  const governance = simulateGovernance({
    actor: input.actor,
    action: input.action,
    resource: input.agents,
    context: input.context
  });

  const proposal = buildActionProposal(input);

  return (
    <div className="layer2-console">

      <Section title="INPUT">
        {JSON.stringify(input, null, 2)}
      </Section>

      <Section title="VALIDATION STATUS">
        {JSON.stringify(validation, null, 2)}
      </Section>

      <Section title="GOVERNANCE REQUEST">
        {JSON.stringify(governance.request, null, 2)}
      </Section>

      <Response title="GOVERNANCE RESPONSE">
        {governance.response}
      </Response>

      <Section title="FINAL ACTION PROPOSAL">
        {JSON.stringify(proposal, null, 2)}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="layer2-section">
      <div className="layer2-section-title">{title}</div>
      <pre className="layer2-pre">{children}</pre>
    </div>
  );
}

function Response({ title, children }) {
  return (
    <div className="layer2-section">
      <div className="layer2-section-title">{title}</div>
      <div className="layer2-response">{children}</div>
    </div>
  );
}