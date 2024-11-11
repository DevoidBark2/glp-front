export type ChnagePasswordType = {
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

