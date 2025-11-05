export const hasPermission = (permissions, moduleName, actionName = 'Can View') => {
  return permissions?.some(
    (perm) =>
      perm.moduleName === moduleName &&
      perm.mActionName === actionName &&
      perm.setDefaultAction === true
  );
};
