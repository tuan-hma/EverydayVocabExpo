import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { boolean } from "mobx-state-tree/dist/internal"
import moment from "moment"
import { Platform } from "react-native"
import { MoodSumItem } from "../components/mood-sum/mood-sum"
import { FeedSnapshot } from "../models/feed-store/feed"
import { MoodUtil } from "../models/mood"

export async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  })
}

const getMoodSumResult = (feeds: FeedSnapshot[]): MoodSumItem[] => {
  const moods = MoodUtil.getMoods()
  let result: MoodSumItem[] = moods.map((m) => ({
    mood: m,
    count: 0,
  }))
  feeds.forEach((f) => {
    try {
      result.find((mood) => mood.mood.code === f.emotion).count += 1
    } catch {}
  })
  result = result.filter((a) => a.count !== 0)
  result.sort((a, b) => -a.count + b.count)
  return result
}

export async function requestPermissionsAsync() {
  return await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  })
}

export async function notificationSettingChange(isOn: boolean) {
  if (!isOn) {
    await Notifications.cancelAllScheduledNotificationsAsync()
  }
}

export async function scheduleYesterdayResultNoti(feeds: FeedSnapshot[]) {
  console.log("this was trigger")
  const moodsum = getMoodSumResult(feeds)
  let emoText = ""
  moodsum.forEach((mood) => (emoText += `${mood.count}x${mood.mood.emoji} `))
  let title = "🥺 I'm missing you"
  let content = "Let's write something for today"

  if (moodsum.length > 0) {
    title = "✏️Yesterday's summary!"
    content = `${emoText}, let's write something for today`
  }

  await Notifications.cancelAllScheduledNotificationsAsync()
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: content,
      data: { data: "goes here" },
    },
    trigger: { date: moment(moment().add(1, "d").format("YYYY/MM/DD") + " 09:00:00").toDate() },
  })
}

export async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!")
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    console.log(token)
  } else {
    alert("Must use physical device for Push Notifications")
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  return token
}
