export type User = {
  user_id: number
  state: string
  invited_by: number
  referals: number
  last_activity: string
  subscribed: number
  is_admin: number
  is_newbie?: boolean
}
