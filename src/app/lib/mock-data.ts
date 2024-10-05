import { TagStatus } from "./model";

const now = Date.now()

const tags = [
    {
        tag_name: "Age",
        tag_desc: "Age of Users",
        tag_status: TagStatus.Normal,
        create_time: now,
        update_time: now,
    },
    {
        tag_name: "Region",
        tag_desc: "Region of Users",
        tag_status: TagStatus.Normal,
        create_time: now,
        update_time: now,
    }
]

export { tags }