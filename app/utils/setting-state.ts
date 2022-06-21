import { notificationSettingChange } from "./notification"
import { loadString, save, saveString } from "./storage"

const IS_DAILY_NOTI = "@is_daily_noti"

export class SettingState {
  public static isDailySummary = async (): Promise<boolean> => {
    const stringData = await loadString(IS_DAILY_NOTI)
    return (await loadString(IS_DAILY_NOTI)) !== "false"
  }

  public static setIsDailySummary = async (data: boolean) => {
    notificationSettingChange(data)
    saveString(IS_DAILY_NOTI, data ? "true" : "false")
  }
}
