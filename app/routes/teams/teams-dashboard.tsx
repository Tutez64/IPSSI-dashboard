import { TeamsProvider } from "~/contexts/teams/TeamsContext";
import { TeamsDashboard } from "~/pages/TeamsDashboard/TeamsDashboard";

export default function TeamsDashboardPage() {
    return (
        <TeamsProvider>
            <TeamsDashboard />
        </TeamsProvider>
    );
}