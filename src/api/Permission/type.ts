export interface UserInfo {
    "ID": number;
    "OpenID": string;
    "Password": string;
    "Avatar": string;
    "Username": string;
    "Phone": number;
    "Sex": number;
    "Age": number;
    "OrderNum": number;
    "Enable": boolean;
    "LastLoginTime": Date; // 使用Date类型代替string
    "CreatedAt": Date; // 使用Date类型代替string
    "UpdatedAt": Date; // 使用Date类型代替string
}
