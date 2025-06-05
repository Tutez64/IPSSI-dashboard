import React, { createContext, useContext, useEffect, useState } from "react";
import type {Team, Member} from "~/types";

interface TeamsContextType {
    allTeams: Team[];
    paginatedTeams: Team[];
    allMembers: Member[];
    fetchTeams: () => Promise<void>;
    fetchMembers: () => Promise<void>;
    assignMemberToTeam: (teamId: string | number | bigint | ((prevState: (number | null)) => (number | null)) | null | undefined, memberId: React.Key | null | undefined) => void;
    removeMemberFromTeam: (teamId: string | number | bigint | ((prevState: (number | null)) => (number | null)) | null | undefined, memberId: React.Key | null | undefined) => void;
    setSortBy: (key: keyof Team | "memberCount") => void;
    setCurrentPage: (page: number) => void;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export const TeamsProvider = ({ children }: { children: React.ReactNode }) => {
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [allMembers, setAllMembers] = useState<Member[]>([]);
    const [sortBy, setSortBy] = useState<keyof Team | "memberCount">("title");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    useEffect(() => {
        fetchTeams();
        fetchMembers();
    }, []);

    const fetchTeams = async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        setAllTeams(data.slice(0, 20).map((t: any) => ({ ...t, assignedMemberIds: [] })));
    };

    const fetchMembers = async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        setAllMembers(data);
    };

    const assignMemberToTeam = (teamId: number, memberId: number) => {
        setAllTeams(prev =>
            prev.map(t =>
                t.id === teamId && !t.assignedMemberIds.includes(memberId)
                    ? { ...t, assignedMemberIds: [...t.assignedMemberIds, memberId] }
                    : t
            )
        );
    };

    const removeMemberFromTeam = (teamId: number, memberId: number) => {
        setAllTeams(prev =>
            prev.map(t =>
                t.id === teamId
                    ? { ...t, assignedMemberIds: t.assignedMemberIds.filter(id => id !== memberId) }
                    : t
            )
        );
    };

    const sortedTeams = [...allTeams].sort((a, b) => {
        if (sortBy === "memberCount") {
            return b.assignedMemberIds.length - a.assignedMemberIds.length;
        }

        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue;
        }

        return 0;
    });


    const totalPages = Math.ceil(sortedTeams.length / pageSize);
    const paginatedTeams = sortedTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <TeamsContext.Provider
            value={{
                allTeams,
                paginatedTeams,
                allMembers,
                fetchTeams,
                fetchMembers,
                assignMemberToTeam,
                removeMemberFromTeam,
                setSortBy,
                setCurrentPage,
                currentPage,
                pageSize,
                totalPages,
            }}>
            {children}
        </TeamsContext.Provider>
    );
};

export const useTeams = () => {
    const context = useContext(TeamsContext);
    if (!context) throw new Error("useTeams doit être utilisé dans TeamsProvider");
    return context;
};