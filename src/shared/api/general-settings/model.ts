import {ComplexityPasswordEnum} from "@/shared/api/auth/model";
import {UserRole} from "@/shared/api/user/model";

export type GeneralSettingsType = {
    id: number;
    platform_name: string;
    subscription_platform: string;
    logo_url: string;
    contact_phone: string;
    support_email: string;
    service_mode: boolean;
    cache_enabled: boolean;
    min_password_length: number;
    service_mode_text: string;
    password_complexity: ComplexityPasswordEnum;
    default_user_role: UserRole;
    auto_confirm_register: boolean;
    user_complaint_notification: boolean;
    period_of_inactive: number;
    auto_publish_course: boolean;
    max_upload_file_size: number;
    moderation_review_course: boolean;
    moderation_new_course: boolean;
    allow_extra_materials: boolean
}
