import { useState } from "react";
import { useTeams } from "~/contexts/teams/TeamsContext";

export function TeamsDashboard() {
    const {
        paginatedTeams,
        allMembers,
        assignMemberToTeam,
        removeMemberFromTeam,
        setSortBy,
        setCurrentPage,
        currentPage,
        totalPages,
    } = useTeams();
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Tableau de bord des équipes</h1>

            <div className="flex gap-4 justify-center mb-6">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setSortBy("title")}
                >
                    Trier par nom
                </button>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setSortBy("memberCount")}
                >
                    Trier par nombre de membres
                </button>
            </div>

            <div className="space-y-6">
                {paginatedTeams.map((team) => (
                    <div
                        key={team.id}
                        className="border rounded-xl shadow-sm p-6 bg-white"
                    >
                        <h2 className="text-xl font-semibold mb-2">{team.title}</h2>
                        <p className="text-gray-700 mb-2">{team.body}</p>
                        <p className="mb-4">
                            <strong>Membres assignés :</strong>{" "}
                            {team.assignedMemberIds.map(id => allMembers.find(m => m.id === id)?.name).join(", ") || "Aucun"}
                        </p>
                        <button
                            className="px-3 py-1 hover:bg-gray-300 rounded bg-blue-600"
                            onClick={() => setSelectedTeamId(selectedTeamId === team.id ? null : team.id)}
                        >
                            Gérer les membres
                        </button>

                        {selectedTeamId === team.id && (
                            <div className="mt-4">
                                <h4 className="font-medium mb-2;">Gestion des membres</h4>
                                <div className="space-y-2">
                                    {allMembers.map(member => (
                                        <div
                                            key={member.id}
                                            className="flex justify-between items-center p-2 border rounded-md"
                                        >
                                            <span>{member.name}</span>
                                            {team.assignedMemberIds.includes(member.id) ? (
                                                <button
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                    onClick={() => removeMemberFromTeam(team.id, member.id)}
                                                >
                                                    Désassigner
                                                </button>
                                            ) : (
                                                <button
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                    onClick={() => assignMemberToTeam(team.id, member.id)}
                                                >
                                                    Assigner
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-gray-400 rounded"
                    onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                >
                    Précédent
                </button>
                <span>
          Page <strong>{currentPage}</strong> / {totalPages}
        </span>
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-gray-400 rounded"
                    onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
