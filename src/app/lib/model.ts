export enum TagStatus {
    Invalid = 0,
    Normal = 1,
    Pending = 2,
    Deleted = 3,
}

export type Tag = {
    tag_id: number,
    tag_name: string,
    tag_desc: string,
    tag_status: TagStatus,
    create_time: number,
    update_time: number,
}