export type ChangePasswordType = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export enum ComplexityPasswordEnum {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    VERY_HIGH = 'very_high',
}

export enum AuthMethodEnum {
    CREDENTIALS = 'credentials',
    GOOGLE = 'google',
    YANDEX = 'yandex'
}
