// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {createSelector} from 'reselect';
import {getCurrentUser, getCurrentChannelId} from 'selectors/entities/common';
import {getTeamMemberships, getCurrentTeamId} from './teams';
import {GlobalState} from 'types/store';
import {getMySystemPermissions, getMySystemRoles, getRoles} from 'selectors/entities/roles_helpers';

export {getMySystemPermissions, getMySystemRoles, getRoles};

export const getMyTeamRoles = createSelector(
    getTeamMemberships,
    (teamsMemberships) => {
        const roles = {};
        if (teamsMemberships) {
            for (const key in teamsMemberships) {
                if (teamsMemberships.hasOwnProperty(key) && teamsMemberships[key].roles) {
                    roles[key] = new Set<string>(teamsMemberships[key].roles.split(' '));
                }
            }
        }
        return roles;
    }
);

export const getMyChannelRoles = createSelector(
    (state: GlobalState) => state.entities.channels.myMembers,
    (channelsMemberships) => {
        const roles = {};
        if (channelsMemberships) {
            for (const key in channelsMemberships) {
                if (channelsMemberships.hasOwnProperty(key) && channelsMemberships[key].roles) {
                    roles[key] = new Set<string>(channelsMemberships[key].roles.split(' '));
                }
            }
        }
        return roles;
    }
);

export const getMyRoles = createSelector(
    getMySystemRoles,
    getMyTeamRoles,
    getMyChannelRoles,
    (systemRoles, teamRoles, channelRoles) => {
        return {
            system: systemRoles,
            team: teamRoles,
            channel: channelRoles,
        };
    }
);

export const getRolesById = createSelector(
    getRoles,
    (rolesByName) => {
        const rolesById = {};
        for (const role of Object.values(rolesByName)) {
            rolesById[role.id] = role;
        }
        return rolesById;
    }
);

export const getMyCurrentTeamPermissions = createSelector(
    getMyTeamRoles,
    getRoles,
    getMySystemPermissions,
    getCurrentTeamId,
    (myTeamRoles, roles, systemPermissions, teamId) => {
        const permissions = new Set();
        if (myTeamRoles[teamId]) {
            for (const roleName of myTeamRoles[teamId]) {
                if (roles[roleName]) {
                    for (const permission of roles[roleName].permissions) {
                        permissions.add(permission);
                    }
                }
            }
        }
        for (const permission of systemPermissions) {
            permissions.add(permission);
        }
        return permissions;
    }
);

export const getMyCurrentChannelPermissions = createSelector(
    getMyChannelRoles,
    getRoles,
    getMyCurrentTeamPermissions,
    getCurrentChannelId,
    (myChannelRoles, roles, teamPermissions, channelId) => {
        const permissions = new Set();
        if (myChannelRoles[channelId]) {
            for (const roleName of myChannelRoles[channelId]) {
                if (roles[roleName]) {
                    for (const permission of roles[roleName].permissions) {
                        permissions.add(permission);
                    }
                }
            }
        }
        for (const permission of teamPermissions) {
            permissions.add(permission);
        }
        return permissions;
    }
);

export const getMyTeamPermissions = createSelector(
    getMyTeamRoles,
    getRoles,
    getMySystemPermissions,
    (state, options) => options.team,
    (myTeamRoles, roles, systemPermissions, teamId) => {
        const permissions = new Set();
        if (myTeamRoles[teamId]) {
            for (const roleName of myTeamRoles[teamId]) {
                if (roles[roleName]) {
                    for (const permission of roles[roleName].permissions) {
                        permissions.add(permission);
                    }
                }
            }
        }
        for (const permission of systemPermissions) {
            permissions.add(permission);
        }
        return permissions;
    }
);

export const getMyChannelPermissions = createSelector(
    getMyChannelRoles,
    getRoles,
    getMyTeamPermissions,
    (state, options) => options.channel,
    (myChannelRoles, roles, teamPermissions, channelId) => {
        const permissions = new Set();
        if (myChannelRoles[channelId]) {
            for (const roleName of myChannelRoles[channelId]) {
                if (roles[roleName]) {
                    for (const permission of roles[roleName].permissions) {
                        permissions.add(permission);
                    }
                }
            }
        }
        for (const permission of teamPermissions) {
            permissions.add(permission);
        }
        return permissions;
    }
);

export const haveISystemPermission = createSelector(
    getMySystemPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    }
);

export const haveITeamPermission = createSelector(
    getMyTeamPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    }
);

export const haveIChannelPermission = createSelector(
    getMyChannelPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    }
);

export const haveICurrentTeamPermission = createSelector(
    getMyCurrentTeamPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    }
);

export const haveICurrentChannelPermission = createSelector(
    getMyCurrentChannelPermissions,
    (state, options) => options.permission,
    (permissions, permission) => {
        return permissions.has(permission);
    }
);
