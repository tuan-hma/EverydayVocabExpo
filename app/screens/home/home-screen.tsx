import React, { FC, useEffect, useRef, useState } from "react"
import LottieView from "lottie-react-native"
import {
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
  SafeAreaView,
  Dimensions,
  Alert,
  SectionList,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { useFocusEffect } from "@react-navigation/native"
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
  Fab,
  FlatList,
  AspectRatio,
} from "native-base"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SelectableBox } from "../../components/selectable-box/selectable-box"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
// import { ScrollView } from "react-native-gesture-handler"
import { VocabBox } from "../../components/vocab-box/vocab-box"
import * as Notifications from "expo-notifications"
import {
  registerForPushNotificationsAsync,
  schedulePushNotification,
  scheduleYesterdayResultNoti,
} from "../../utils/notification"
import { useStores } from "../../models"
import { EmojiImage } from "../../utils/emoji-image"
import { MainFeed } from "../../components/main-feed/main-feed"
import moment from "moment"
import { FeedSnapshot } from "../../models/feed-store/feed"
import { MoodSum } from "../../components/mood-sum/mood-sum"
import { CommonButton } from "../../components/common-button/common-button"
import { SettingState } from "../../utils/setting-state"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
  flex: 1,
}

const addIcon = require("./add-icon.png")
const settingIcon = require("./setting-icon.png")

interface FeedSection {
  title: string
  data: FeedSnapshot[]
}

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation, route }) => {
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
    const afterPost: boolean | undefined = route.params?.afterPost
    const [congrated, setCongrated] = useState(false)
    const sectionList = useRef<SectionList>()
    useFocusEffect(
      React.useCallback(() => {
        setCongrated(false)
        if (afterPost) {
          setSelectedDate(moment().format(DATE_FORMAT))
          sectionList?.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: todayFeeds.length - 1,
          })
          SettingState.isDailySummary().then((isOk) => {
            if (isOk) {
              scheduleYesterdayResultNoti(todayFeeds)
            }
          })
        }
        AsyncStorage.getItem("@onboard01").then((isOnboard) => {
          if (!isOnboard) {
            AsyncStorage.setItem("@onboard01", "1")
            navigation.navigate("onboarding")
          }
        })
      }, []),
    )

    const [confirmDeleteFeed, setConfirmDeleteFeed] = useState<FeedSnapshot | null>(null)

    const getCarouselData = (feeds: FeedSnapshot[]): number[] => {
      if (feeds.length === 0) {
        return [0]
      }
      const result: number[] = []
      const duration = moment.duration(moment().weekday(7).diff(moment(feeds[0].id)))
      const weeksCount = Math.floor(duration.asWeeks())
      for (let i = weeksCount; i >= 0; i--) {
        result.push(i)
      }
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
    // const sectionData: FeedSection[] = Array.from(feedsDictionary.entries()).map((source) => {
    //   return { title: source[0], data: source[1] } as FeedSection
    // })
    const sectionData: FeedSection[] = [{ title: selectedDate, data: todayFeeds }]

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
    return (
      <View
        removeClippedSubviews
        shouldRasterizeIOS
        renderToHardwareTextureAndroid
        testID="WelcomeScreen"
        style={FULL}
      >
        <Screen preset="fixed" backgroundColor={color.palette.background}>
          <ZStack flexGrow={1} flexDirection="column">
            <Flex direction="column" h="100%">
              <Flex direction="column" pb="10px">
                <Box>
                  <Flex
                    pl="10px"
                    pr="5"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-end"
                  >
                    <Text color={color.palette.text} fontSize="md" fontWeight="bold">
                      {moment(new Date(selectedDate)).format("YYYY, dddd MMM DD")}
                    </Text>
                    <Text color={color.palette.milderText} fontWeight="bold" fontSize="xl">
                      {moment(firstDayOfCarousel).format("MMMM YYYY")}
                    </Text>
                  </Flex>

                  <Box pt="5px" pb="5px">
                    <Carousel
                      // ref={(c) => {
                      //   this._carousel = c
                      // }}
                      data={carouselData}
                      renderItem={_renderItem}
                      sliderWidth={Dimensions.get("window").width}
                      itemWidth={Dimensions.get("window").width}
                      firstItem={carouselData.length - 1}
                      onSnapToItem={(index) => {
                        const item = carouselData[index]
                        setFirstDayOfCarousel(
                          moment()
                            .clone()
                            .add(-7 * item, "d")
                            .weekday(2)
                            .toDate(),
                        )
                      }}
                    />
                  </Box>
                  <HStack
                    mt="10px"
                    mr="10px"
                    ml="10px"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text mr="10px" color={color.palette.text} fontWeight="bold" fontSize="2xl">
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
                    <MoodSum feeds={todayFeeds} />
                  </HStack>
                </Box>
              </Flex>
              <ZStack bg="#00000018" w="full" flexGrow="1" justifyContent="flex-end">
                <Flex
                  // borderTopWidth="1"
                  // borderColor={color.palette.backgroundSelected}
                  pl="3"
                  pr="3"
                  h="full"
                  flexGrow={1}
                  w="full"
                >
                  {todayFeeds.length === 0 ? (
                    <VStack mt="20px">
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
                        <>
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
                          <AspectRatio
                            w="full"
                            ratio={{
                              base: 898 / 678,
                            }}
                          >
                            <Box shadow="3">
                              <LottieView
                                autoPlay
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{
                                  flex: 1,
                                }}
                                // Find more Lottie files at https://lottiefiles.com/featured
                                source={require("./spaceman.json")}
                              />
                            </Box>
                          </AspectRatio>
                        </>
                      )}
                    </VStack>
                  ) : (
                    <SectionList
                      onScrollToIndexFailed={() => {}}
                      // getItemLayout={(data) ={}}
                      ref={sectionList}
                      decelerationRate={0.5}
                      showsVerticalScrollIndicator={false}
                      sections={sectionData}
                      renderItem={(item) => {
                        // setSelectedDate(item.section.title)
                        return (
                          <Box
                            mt={item.index === 0 ? "10px" : "0px"}
                            mb={item.index === todayFeeds.length - 1 ? "100px" : "0px"}
                          >
                            <MainFeed
                              feed={item.item as FeedSnapshot}
                              key={(item.item as FeedSnapshot).id as number}
                              onClick={() => {
                                setConfirmDeleteFeed(todayFeeds[item.index])
                                deleteOption.onOpen()
                              }}
                            />
                          </Box>
                        )
                      }}
                      keyExtractor={(item, index) => (item as FeedSnapshot)?.id?.toString() ?? ""}
                    />
                  )}
                </Flex>
                <Box shadow="9" pt="10px" pb="20px" pr="10px" alignSelf="center">
                  <CommonButton
                    onClick={() => {
                      navigation.navigate("yourday")
                    }}
                    icon={addIcon}
                    text="Add note"
                  />
                </Box>
                <Box shadow="9" pt="10px" pb="20px" pr="10px" alignSelf="flex-end">
                  <CommonButton
                    onClick={() => {
                      navigation.navigate("setting")
                    }}
                    icon={settingIcon}
                  />
                </Box>
                {afterPost && !congrated && todayFeeds.length === 1 && (
                  <AspectRatio alignSelf="center" mb="30%" w="full" ratio={1 / 1}>
                    <VStack bg={color.palette.backgroundSelected} rounded="30px" w="full" h="full">
                      <Text
                        mt="30px"
                        textAlign="center"
                        color={color.palette.text}
                        fontWeight="bold"
                        fontSize="2xl"
                      >
                        First post of the day, keep going
                      </Text>
                      <LottieView
                        speed={0.8}
                        onAnimationFinish={() => {
                          setCongrated(true)
                        }}
                        loop={false}
                        autoPlay
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          flex: 1,
                        }}
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("./congrate.json")}
                      />
                    </VStack>
                  </AspectRatio>
                )}
              </ZStack>

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
            </Flex>
          </ZStack>
        </Screen>
      </View>
    )
  },
)
