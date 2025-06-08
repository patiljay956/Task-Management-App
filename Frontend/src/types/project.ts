import type { User } from "./auth";

export type Project = {
    _id: string;
    name: string;
    description: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};
