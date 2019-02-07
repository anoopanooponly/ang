export class Worker {
    _id: string;
    username: string;
    email: string;
    phone: {
        code: string,
        number: string
    };
    gender: string;
    about: string;
    avatar: string;
    name: {
        first_name: string;
        last_name: string;
    };
    avg_review: number;
    total_review: number;
    address: Address;    
    role: string;
    activity: Activity;
    location_id: string;
    billing_address: Address;
    location: {
        lng: number;
        lat: number;
    };
    radius: number;
    radiusby: string;
    socialnetwork: {
        facebook_link: string;
        twitter_link: string;
        googleplus_link: string;
    };    
    birthdate: {
        year: number;
        month: number;
        date: number;
    };
    taskerskills: Array<Skill>;
    device_info: DeviceInfo;
};

class Address 
{
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
};

class Activity
{
    last_login: Date;
    last_logout: Date;
    last_active_time: Date;
};

class Skill 
{
    _id: string;
    categoryid: string;
    childid: string;
    name: string;
    quick_pitch: string;
    hour_rate: number;
    experience: string;
    status: number;
}

class DeviceInfo
{
    device_type: string; //ios/android
    device_token: string;
    gcm: string;
    fcm: string;
    android_notification_mode: string; //socket/gcm/fcm
    ios_notification_mode: string; //socket/apns
    notification_mode: string; //socket/apns/gcm
}