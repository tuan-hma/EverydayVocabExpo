import React, { FC, useEffect, useRef, useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground, AutoImage } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import Carousel from "react-native-snap-carousel"
import {
  Flex,
  Button as NBButton,
  VStack,
  HStack,
  ZStack,
  Radio,
  Box,
  Pressable,
  Badge,
  Spacer,
  Text,
  Icon,
  ChevronLeftIcon,
  IconButton,
  Image,
  ScrollView,
  useDisclose,
  Actionsheet,
  AlertDialog,
  Button,
} from "native-base"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { MaterialCommunityIcons } from "@expo/vector-icons"
// import { ScrollView } from "react-native-gesture-handler"
import { VocabBox } from "../../components/vocab-box/vocab-box"
import * as Notifications from "expo-notifications"
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
} from "../../utils/notification"
import { useStores } from "../../models"
import { EmojiImage } from "../../utils/emoji-image"
import { MainFeed } from "../../components/main-feed/main-feed"
import moment from "moment"
import { FeedSnapshot } from "../../models/feed-store/feed"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

const addIcon = require("./add-icon.png")

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation }) => {
    const DATE_FORMAT = "YYYY-MM-DD"
    const { feedStore } = useStores()
    const notificationListener = useRef()
    const responseListener = useRef()
    const cancelDeleteRef = React.useRef(null)
    const deleteOption = useDisclose()
    const deleteConfirm = useDisclose()
    const [selectedDate, setSelectedDate] = useState(moment().format(DATE_FORMAT))
    const [firstDayOfCarousel, setFirstDayOfCarousel] = useState(new Date())
    const todayFeeds = feedStore.feeds.filter(
      (feed) => moment(feed.id).format(DATE_FORMAT) === selectedDate,
    )
    const [confirmDeleteFeed, setConfirmDeleteFeed] = useState<FeedSnapshot | null>(null)

    const getCarouselData = (feeds: FeedSnapshot[]): number[] => {
      if (feeds.length === 0) {
        return [0]
      }
      const result: number[] = []
      const duration = moment.duration(moment().weekday(7).diff(moment(feeds[0].id)))
      const weeksCount = Math.floor(duration.asWeeks())
      console.log("week count:", weeksCount)
      for (let i = weeksCount; i >= 0; i--) {
        result.push(i)
      }
      console.log("result")
      return result
    }
    // TODO impl this shit
    const carouselData = getCarouselData(feedStore.feeds)

    const getDictionaryFromFeeds = (feeds: FeedSnapshot[]): Map<string, FeedSnapshot[]> => {
      const dictionary = new Map<string, FeedSnapshot[]>()
      feeds.forEach((feed) => {
        let feedsOfDate = dictionary.get(moment(feed.id).format(DATE_FORMAT))
        if (!feedsOfDate) {
          feedsOfDate = []
          dictionary.set(moment(feed.id).format(DATE_FORMAT), feedsOfDate)
        }
        feedsOfDate.push(feed)
      })
      return dictionary
    }
    const feedsDictionary = getDictionaryFromFeeds(feedStore.feeds)

    function DayPick(date: Date, action: () => void) {
      const dateFormated = moment(date).format(DATE_FORMAT)
      const isSelected = dateFormated === selectedDate
      const isFuture = date > new Date()
      const isHaveNote = feedsDictionary?.get(dateFormated)?.length > 0 ?? false

      return (
        <Pressable
          onPress={() => {
            if (!isFuture) {
              action()
            }
          }}
          flexBasis="14.28%"
          key={date.getDay()}
        >
          {({ isHovered, isFocused, isPressed }) => {
            return (
              <VStack
                ml="5px"
                mr="5px"
                style={{
                  transform: [
                    {
                      scale: isPressed ? 0.9 : 1,
                    },
                  ],
                }}
                rounded="10px"
                bg={
                  isSelected
                    ? {
                        linearGradient: {
                          colors: ["#926fef", "#7751e9"],
                          start: [1, 0],
                          end: [0, 1],
                        },
                      }
                    : "transparent"
                }
                alignItems="center"
              >
                <Text
                  color={isSelected ? color.palette.accent : color.palette.mildText}
                  fontSize="md"
                  fontWeight="bold"
                >
                  {moment(date).format("ddd")}
                </Text>
                <Box
                  w="5px"
                  h="5px"
                  bg={isHaveNote ? color.palette.accent : color.transparent}
                  rounded="full"
                ></Box>
                <Text
                  color={isFuture ? color.palette.mildText : color.palette.text}
                  fontSize="lg"
                  fontWeight="bold"
                >
                  {date.getDate()}
                </Text>
              </VStack>
            )
          }}
        </Pressable>
      )
    }

    const _renderItem = ({ item, index }) => {
      return (
        <HStack>
          {[...Array(7).keys()].map((dateNum) =>
            DayPick(
              moment()
                .clone()
                .add(-7 * item, "d")
                .weekday(dateNum)
                .add(1, "d")
                .toDate(),
              () => {
                setSelectedDate(
                  moment()
                    .clone()
                    .add(-7 * item, "d")
                    .weekday(dateNum)
                    .add(1, "d")
                    .format(DATE_FORMAT),
                )
              },
            ),
          )}
        </HStack>
      )
    }

    // useEffect(() => {
    //   registerForPushNotificationsAsync().then((token) => console.log(token))

    //   notificationListener.current = Notifications.addNotificationReceivedListener(
    //     (notification) => {
    //       setNotification(notification)
    //     },
    //   )

    //   responseListener.current = Notifications.addNotificationResponseReceivedListener(
    //     (response) => {
    //       console.log(response)
    //     },
    //   )

    //   return () => {
    //     Notifications.removeNotificationSubscription(notificationListener.current)
    //     Notifications.removeNotificationSubscription(responseListener.current)
    //   }
    // }, [])
    return (
      <View
        removeClippedSubviews
        shouldRasterizeIOS
        renderToHardwareTextureAndroid
        testID="WelcomeScreen"
        style={FULL}
      >
        <Screen style={CONTAINER} preset="scroll" backgroundColor={color.palette.background}>
          <ZStack>
            {/* <Image mt="130px" w="full" h="220px" source={wavyBg} /> */}
            <Box mt="330px" w="full" h="900px" backgroundColor={color.palette.background}></Box>
          </ZStack>
          <Flex mr="10px" w="40px" h="40px" alignSelf="flex-end">
            {/* <IconButton
              borderRadius="full"
              onPress={() => {
                navigation.navigate("yourday")
              }}
              icon={
                <Icon
                  size="xl"
                  as={MaterialCommunityIcons}
                  name="cog"
                  color="white"
                  _dark={{
                    color: "warmGray.50",
                  }}
                />
              }
            ></IconButton> */}
          </Flex>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }}
          />
          <HStack pt="0" pb="0" w="full">
            <Flex mt="-10px" direction="column">
              <Text pl="5" color={color.palette.mildText} fontSize="md" fontWeight="bold">
                {moment(new Date(selectedDate)).format("YYYY, dddd MMM DD")}
              </Text>
              <Flex
                pl="5"
                pr="5"
                direction="row"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Text color={color.palette.text} fontWeight="bold" fontSize="3xl">
                  {((): string => {
                    const duration = moment.duration(moment().diff(moment(selectedDate)))
                    const days = Math.floor(duration.asDays())
                    if (days === 0) {
                      return "Today"
                    } else if (days === 1) {
                      return "Yesterday"
                    }
                    return `${days} days ago`
                  })()}
                </Text>
                <Text color={color.palette.milderText} fontWeight="bold" fontSize="2xl">
                  {moment(firstDayOfCarousel).format("MMMM YYYY")}
                </Text>
              </Flex>

              <Carousel
                // ref={(c) => {
                //   this._carousel = c
                // }}
                data={carouselData}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width}
                itemWidth={Dimensions.get("window").width}
                firstItem={3}
                onSnapToItem={(index) => {
                  const item = carouselData[index]
                  console.log("snaped to:", item)
                  setFirstDayOfCarousel(
                    moment()
                      .clone()
                      .add(-7 * item, "d")
                      .weekday(2)
                      .toDate(),
                  )
                }}
              />
              {/* <HStack>
                {[...Array(7).keys()].map((dateNum) =>
                  DayPick(moment().clone().weekday(dateNum).add(1, "d").toDate(), () => {
                    setSelectedDate(
                      moment().clone().weekday(dateNum).add(1, "d").format("yyyy-MM-dd"),
                    )
                  }),
                )}
              </HStack> */}
            </Flex>
            <Spacer />
          </HStack>

          {/* <Flex p="5" mt="10px">
            <Text color="white" fontWeight="bold" fontSize="xl">
              Today's Vocab
            </Text>
            <VocabBox
              onClick={() => {
                // allowsNotificationsAsync()
                // navigation.navigate("vocab")
                feedStore.clearFeed()
              }}
              size="big"
              levelText={"Intermediate / N3"}
              hiragana={"せいひん"}
              kanji={"製品"}
              meaning={"product"}
              sample={"完成した製品を検査する"}
            />
          </Flex> */}

          <Flex h="full" mt="20px">
            <Flex
              // bg={color.palette.backgroundSelected}
              pt="10px"
              pb="5px"
              pr="5px"
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text color={color.palette.text} pl="5" fontWeight="bold" fontSize="xl">
                Diary Notes
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("yourday")
                }}
              >
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <Box
                      renderToHardwareTextureAndroid
                      shouldRasterizeIOS
                      shadow="9"
                      flexDirection="row"
                      alignItems="center"
                      p="10px"
                      style={{
                        transform: [
                          {
                            scale: isPressed ? 0.96 : 1,
                          },
                        ],
                      }}
                      bg={{
                        linearGradient: {
                          colors: ["#926fef", "#7751e9"],
                          start: [1, 0],
                          end: [0, 1],
                        },
                      }}
                      w="150px"
                      h="62px"
                      rounded="20px"
                    >
                      <Box w="40px" shadow="4">
                        <Image w="40px" h="40px" source={addIcon} alt="addIcon" />
                      </Box>

                      <Text
                        ml="10px"
                        shadow="9"
                        fontSize="md"
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                      >
                        Add Note
                      </Text>
                    </Box>
                  )
                }}
              </Pressable>
            </Flex>
            <Flex direction="column" p="10px" w="full">
              {todayFeeds.length === 0 ? (
                <VStack>
                  <Text
                    ml="10px"
                    shadow="9"
                    fontSize="md"
                    fontWeight="bold"
                    color={color.palette.mildText}
                    textAlign="center"
                  >
                    No diary note on this day
                  </Text>
                  {moment().format(DATE_FORMAT) === selectedDate && (
                    <Text
                      ml="10px"
                      shadow="9"
                      fontSize="lg"
                      fontWeight="bold"
                      color={color.palette.text}
                      textAlign="center"
                    >
                      {" "}
                      Let's note something !
                    </Text>
                  )}
                </VStack>
              ) : (
                todayFeeds.map((feed) => (
                  <MainFeed
                    feed={feed}
                    key={feed.id}
                    onClick={() => {
                      setConfirmDeleteFeed(feed)
                      deleteOption.onOpen()
                    }}
                  />
                ))
              )}
            </Flex>
          </Flex>
          <Actionsheet isOpen={deleteOption.isOpen} onClose={deleteOption.onClose}>
            <Actionsheet.Content bg={color.palette.background}>
              <Actionsheet.Item
                bg={color.transparent}
                onPressOut={() => {
                  // deleteConfirm.onOpen()
                  Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete this diary note ?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => deleteOption.onClose(),
                        style: "cancel",
                      },
                      {
                        text: "Delete",
                        onPress: () => {
                          if (confirmDeleteFeed) {
                            feedStore.deleteFeed(confirmDeleteFeed)
                          }
                          deleteOption.onClose()
                        },
                      },
                    ],
                  )
                }}
              >
                <Text fontSize="md" fontWeight="bold" color="white">
                  Delete
                </Text>
              </Actionsheet.Item>
            </Actionsheet.Content>
          </Actionsheet>
        </Screen>
      </View>
    )
  },
)
