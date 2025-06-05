export type Member = {
    id: number;
    name: string;
    email: string;
};

export type Team = {
    id: number;
    title: string;
    body: string;
    assignedMemberIds: number[];
};