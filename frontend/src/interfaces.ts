export interface Supplier {
    id: string,
    name: string,
    type: string,
    building: string,
    floor: string,
    location_description: string,
    latitude: number,
    longitude: number,
    starting_time: string,
    closing_time: string,
    operatingHours: string,
    image_url: string | null,
    is_active: boolean,
    created_at: string,
    updated_at: string
}

export type Role = 'ADMIN' | 'REQUESTER' | 'COURIER'

export interface User {
    id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    roles: Role[]
}