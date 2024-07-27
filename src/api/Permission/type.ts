export interface UserInfo {
    "ID": number;
    "OpenID": string;
    "Username": string;
    "Phone": number | '';
    "RoleName": string;
    "Enable": boolean;
    "LastLoginTime": Date | null; // 使用Date类型代替string
    "CreatedAt": Date; // 使用Date类型代替string
    "UpdatedAt": Date; // 使用Date类型代替string
}


export interface UserParams {
    Page?: string;
    Size?: string;
    /**
     * ADMIN、COACH、STUDENT、COACH&STUDENT
     */
    UserSelectType?: string;
    [property: string]: any;
}

