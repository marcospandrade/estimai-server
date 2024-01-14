interface IExtendedProfile {
    job_title: string;
    organization: string;
    department: string;
    location: string;
}

export class UserAtlassianInfo {
    account_type: string;
    account_id: string;
    email: string;
    name: string;
    picture: string;
    account_status: string;
    nickname: string;
    zoneinfo: string;
    local: string;
    extended_profile: IExtendedProfile;
}
