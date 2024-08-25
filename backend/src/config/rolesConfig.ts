export const rolesConfig = {
  admin: {
    permissions: ["canEdit", "canDelete", "canManageUsers", "canViewAll"],
  },
  user: {
    permissions: ["canEditOwn", "canDeleteOwn", "canViewPublic"],
  },
};

export type Role = keyof typeof rolesConfig;
export const assignPermissions = (userRole: Role): string[] => {
  return rolesConfig[userRole]?.permissions || [];
};
