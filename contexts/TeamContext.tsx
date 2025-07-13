import React, { createContext, useContext, useState, ReactNode } from "react";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "invited" | "inactive";
  joinedAt: string;
  lastActive?: string;
  projects: string[]; // Project IDs the member has access to
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: "admin" | "member" | "viewer";
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: "pending" | "accepted" | "expired";
  projectIds: string[];
}

interface TeamContextType {
  members: TeamMember[];
  invitations: TeamInvitation[];
  getMembersByProject: (projectId: string) => TeamMember[];
  getMembersByRole: (role: TeamMember["role"]) => TeamMember[];
  addMember: (member: Omit<TeamMember, "id" | "joinedAt">) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  inviteMember: (
    email: string,
    role: TeamMember["role"],
    projectIds: string[]
  ) => void;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;
  resendInvitation: (invitationId: string) => void;
  getMemberPermissions: (memberId: string, projectId: string) => string[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const ctx = useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used within TeamProvider");
  return ctx;
};

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Siddique Raza",
      email: "siddiqdev14@gmail.com",
      role: "owner",
      status: "active",
      joinedAt: "2024-01-01T10:00:00Z",
      lastActive: "2024-01-15T14:30:00Z",
      projects: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2024-01-02T09:00:00Z",
      lastActive: "2024-01-15T16:45:00Z",
      projects: ["1", "2"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "member",
      status: "active",
      joinedAt: "2024-01-03T11:00:00Z",
      lastActive: "2024-01-15T12:20:00Z",
      projects: ["1"],
    },
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "viewer",
      status: "active",
      joinedAt: "2024-01-04T13:00:00Z",
      lastActive: "2024-01-15T10:15:00Z",
      projects: ["2"],
    },
  ]);

  const [invitations, setInvitations] = useState<TeamInvitation[]>([
    {
      id: "inv1",
      email: "alex@example.com",
      role: "member",
      invitedBy: "1",
      invitedAt: "2024-01-10T10:00:00Z",
      expiresAt: "2024-01-17T10:00:00Z",
      status: "pending",
      projectIds: ["1"],
    },
    {
      id: "inv2",
      email: "emma@example.com",
      role: "viewer",
      invitedBy: "2",
      invitedAt: "2024-01-12T14:00:00Z",
      expiresAt: "2024-01-19T14:00:00Z",
      status: "pending",
      projectIds: ["2"],
    },
  ]);

  const getMembersByProject = (projectId: string) => {
    return members.filter((member) => member.projects.includes(projectId));
  };

  const getMembersByRole = (role: TeamMember["role"]) => {
    return members.filter((member) => member.role === role);
  };

  const addMember = (memberData: Omit<TeamMember, "id" | "joinedAt">) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `member-${Date.now()}`,
      joinedAt: new Date().toISOString(),
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const updateMember = (id: string, updates: Partial<TeamMember>) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const inviteMember = (
    email: string,
    role: TeamMember["role"],
    projectIds: string[]
  ) => {
    const newInvitation: TeamInvitation = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedBy: "1", // Current user ID
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: "pending",
      projectIds,
    };
    setInvitations((prev) => [newInvitation, ...prev]);
  };

  const acceptInvitation = (invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (invitation) {
      // Add member to team
      addMember({
        name: invitation.email.split("@")[0], // Use email prefix as name
        email: invitation.email,
        role: invitation.role,
        status: "active",
        projects: invitation.projectIds,
      });

      // Update invitation status
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId ? { ...inv, status: "accepted" } : inv
        )
      );
    }
  };

  const declineInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: "expired" } : inv
      )
    );
  };

  const resendInvitation = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              invitedAt: new Date().toISOString(),
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
          : inv
      )
    );
  };

  const getMemberPermissions = (memberId: string, projectId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member || !member.projects.includes(projectId)) {
      return [];
    }

    const permissions = {
      owner: ["read", "write", "delete", "admin", "invite"],
      admin: ["read", "write", "delete", "invite"],
      member: ["read", "write"],
      viewer: ["read"],
    };

    return permissions[member.role] || [];
  };

  return (
    <TeamContext.Provider
      value={{
        members,
        invitations,
        getMembersByProject,
        getMembersByRole,
        addMember,
        updateMember,
        removeMember,
        inviteMember,
        acceptInvitation,
        declineInvitation,
        resendInvitation,
        getMemberPermissions,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
