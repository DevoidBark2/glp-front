import {StatusUserEnum} from "@/enums/StatusUserEnum";

export interface GroupActionComponentProps {
    loading: boolean;
    searchText: string;
    setSearchText: (value: string) => void,
    selectedAction: StatusUserEnum | null;
    setSelectedAction: (value: StatusUserEnum) => void,
    submitSelectedAction: () => Promise<void>,
}