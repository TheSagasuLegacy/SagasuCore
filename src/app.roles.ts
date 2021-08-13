import { RolesBuilder } from 'nest-access-control';

export enum AppResources {
  SERIES = 'SERIES',
  EPISODE = 'EPISODE',
  DIALOG = 'DIALOG',
  FILE = 'FILE',
  USER = 'USER',
  ROLE = 'ROLE',
}

export enum BasicRoles {
  SEARCH_SERIES = 'SEARCH_SERIES',
  READ_SINGLE_SERIES = 'READ_SINGLE_SERIES',
  READ_MULTIPLE_SERIES = 'READ_MULTIPLE_SERIES',
  WRITE_OWN_SERIES = 'WRITE_OWN_SERIES',
  WRITE_ANY_SERIES = 'WRITE_ANY_SERIES',

  READ_SINGLE_EPISODE = 'READ_SINGLE_EPISODE',
  READ_MULTIPLE_EPISODE = 'READ_MULTIPLE_EPISODE',
  WRITE_OWN_EPISODE = 'WRITE_OWN_EPISODE',
  WRITE_ANY_EPISODE = 'WRITE_ANY_EPISODE',

  SEARCH_DIALOG = 'SEARCH_DIALOG',
  READ_SINGLE_DIALOG = 'READ_SINGLE_DIALOG',
  READ_MULTIPLE_DIALOG = 'READ_MULTIPLE_DIALOG',
  WRITE_OWN_DIALOG = 'WRITE_OWN_DIALOG',
  WRITE_ANY_DIALOG = 'WRITE_ANY_DIALOG',

  READ_SINGLE_FILE = 'READ_SINGLE_FILE',
  READ_MULTIPLE_FILE = 'READ_MULTIPLE_FILE',
  WRITE_OWN_FILE = 'WRITE_OWN_FILE',
  WRITE_ANY_FILE = 'WRITE_ANY_FILE',

  READ_OWN_USER = 'READ_OWN_USER',
  READ_ANY_USER = 'READ_ANY_USER',
  WRITE_OWN_USER = 'WRITE_OWN_USER',
  WRITE_ANY_USER = 'WRITE_ANY_USER',

  ADMIN_USER_ROLE = 'MODIFY_USER_ROLE',
}

export enum GroupedRoles {
  ADMINISTRATOR = 'ADMINISTRATOR',
  EDITOR = 'EDITOR',
  REGISTERED_USER = 'REGISTERED_USER',
  GUEST = 'GUEST',
}

export const AppRoles = { ...BasicRoles, ...GroupedRoles };

export const roles: RolesBuilder = new RolesBuilder();

// prettier-ignore
roles
  .grant(BasicRoles.SEARCH_SERIES)
    .readAny(AppResources.SERIES)
  .grant(BasicRoles.READ_SINGLE_SERIES)
    .readAny(AppResources.SERIES)
  .grant(BasicRoles.READ_MULTIPLE_SERIES)
    .readAny(AppResources.SERIES)
  .grant(BasicRoles.WRITE_OWN_SERIES)
    .createOwn(AppResources.SERIES)
    .updateOwn(AppResources.SERIES)
    .deleteOwn(AppResources.SERIES)
  .grant(BasicRoles.WRITE_ANY_SERIES)
    .createAny(AppResources.SERIES)
    .updateAny(AppResources.SERIES)
    .deleteAny(AppResources.SERIES)

  .grant(BasicRoles.READ_SINGLE_EPISODE)
    .readAny(AppResources.EPISODE)
  .grant(BasicRoles.READ_MULTIPLE_EPISODE)
    .readAny(AppResources.EPISODE)
  .grant(BasicRoles.WRITE_OWN_EPISODE)
    .createOwn(AppResources.EPISODE)
    .updateOwn(AppResources.EPISODE)
    .deleteOwn(AppResources.EPISODE)
  .grant(BasicRoles.WRITE_ANY_EPISODE)
    .createAny(AppResources.EPISODE)
    .updateAny(AppResources.EPISODE)
    .deleteAny(AppResources.EPISODE)

  .grant(BasicRoles.SEARCH_DIALOG)
    .readAny(AppResources.DIALOG)
  .grant(BasicRoles.READ_SINGLE_DIALOG)
    .readAny(AppResources.DIALOG)
  .grant(BasicRoles.READ_MULTIPLE_DIALOG)
    .readAny(AppResources.DIALOG)
  .grant(BasicRoles.WRITE_OWN_DIALOG)
    .createOwn(AppResources.DIALOG)
    .updateOwn(AppResources.DIALOG)
    .deleteOwn(AppResources.DIALOG)
  .grant(BasicRoles.WRITE_ANY_DIALOG)
    .createAny(AppResources.DIALOG)
    .updateAny(AppResources.DIALOG)
    .deleteAny(AppResources.DIALOG)

  .grant(BasicRoles.READ_SINGLE_FILE)
    .readAny(AppResources.FILE)
  .grant(BasicRoles.READ_MULTIPLE_FILE)
    .readAny(AppResources.FILE)
  .grant(BasicRoles.WRITE_OWN_FILE)
    .createOwn(AppResources.FILE)
    .updateOwn(AppResources.FILE)
    .deleteOwn(AppResources.FILE)
  .grant(BasicRoles.WRITE_ANY_FILE)
    .createAny(AppResources.FILE)
    .updateAny(AppResources.FILE)
    .deleteAny(AppResources.FILE)

  .grant(BasicRoles.READ_OWN_USER)
    .readOwn(AppResources.USER)
  .grant(BasicRoles.READ_ANY_USER)
    .readAny(AppResources.USER)
  .grant(BasicRoles.WRITE_OWN_USER)
    .updateOwn(AppResources.USER)
    .deleteOwn(AppResources.USER)
  .grant(BasicRoles.WRITE_ANY_USER)
    .createAny(AppResources.USER)
    .updateAny(AppResources.USER)
    .deleteAny(AppResources.USER)

  .grant(BasicRoles.ADMIN_USER_ROLE)
    .readAny(AppResources.ROLE)
    .createAny(AppResources.ROLE)
    .updateAny(AppResources.ROLE)
    .deleteAny(AppResources.ROLE)

// prettier-ignore
roles
  .grant(GroupedRoles.GUEST)
    .inherit(BasicRoles.SEARCH_SERIES)
    .inherit(BasicRoles.READ_SINGLE_SERIES)
    .inherit(BasicRoles.READ_SINGLE_EPISODE)
    .inherit(BasicRoles.READ_MULTIPLE_EPISODE)
    .inherit(BasicRoles.SEARCH_DIALOG)
    .inherit(BasicRoles.READ_SINGLE_DIALOG)
    .inherit(BasicRoles.READ_SINGLE_FILE)
  .grant(GroupedRoles.REGISTERED_USER)
    .inherit(GroupedRoles.GUEST)
      .inherit(BasicRoles.READ_OWN_USER)
      .inherit(BasicRoles.READ_ANY_USER)
      .inherit(BasicRoles.WRITE_OWN_USER)
  .grant(GroupedRoles.EDITOR)
    .inherit(GroupedRoles.REGISTERED_USER)
      .inherit(BasicRoles.READ_MULTIPLE_SERIES)
      .inherit(BasicRoles.WRITE_OWN_SERIES)
      .inherit(BasicRoles.WRITE_OWN_EPISODE)
      .inherit(BasicRoles.READ_MULTIPLE_DIALOG)
      .inherit(BasicRoles.WRITE_OWN_DIALOG)
      .inherit(BasicRoles.READ_MULTIPLE_FILE)
      .inherit(BasicRoles.WRITE_OWN_FILE)
  .grant(GroupedRoles.ADMINISTRATOR)
    .inherit(Object.values(BasicRoles))
