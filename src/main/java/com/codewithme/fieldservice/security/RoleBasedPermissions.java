
package com.codewithme.fieldservice.security;

import com.codewithme.fieldservice.model.Permissions;
import com.codewithme.fieldservice.model.Role;

import java.util.EnumSet;
import java.util.Set;

public class RoleBasedPermissions {

    public static Set<Permissions> getPermissions(Role role) {

        switch (role) {

            case MANAGER:
                return EnumSet.allOf(Permissions.class);

            case DISPATCHER:
                return EnumSet.of(
                        Permissions.WORK_ORDER_CREATE,
                        Permissions.WORK_ORDER_READ,
                        Permissions.WORK_ORDER_UPDATE,
                        Permissions.CUSTOMER_READ,
                        Permissions.SITE_READ,
                        Permissions.PART_READ,
                        Permissions.DASHBOARD_VIEW
                );

            case TECHNICIAN:
                return EnumSet.of(
                        Permissions.WORK_ORDER_READ,
                        Permissions.WORK_ORDER_UPDATE,
                        Permissions.PART_READ,
                        Permissions.TIME_LOG_CREATE,
                        Permissions.TIME_LOG_READ
                );

            case CUSTOMER:
                return EnumSet.of(
                        Permissions.WORK_ORDER_READ,
                        Permissions.CUSTOMER_REQUEST_CREATE,
                        Permissions.CUSTOMER_REQUEST_READ
                );

            default:
                return EnumSet.noneOf(Permissions.class);
        }
    }
}