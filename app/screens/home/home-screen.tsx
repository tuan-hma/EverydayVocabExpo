import React, { FC, useEffect, useRef, useState } from "react"
import LottieView from "lottie-react-native"
import { View, ViewStyle, Dimensions, Alert, SectionList, Modal } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { useFocusEffect } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import * as Haptics from "expo-haptics"
import Carousel from "react-native-snap-carousel"
import ImageViewer from "react-native-image-zoom-viewer"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  Flex,
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
  FlatList,
  AspectRatio,
} from "native-base"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
// import { ScrollView } from "react-native-gesture-handler"

import { scheduleYesterdayResultNoti } from "../../utils/notification"
import { useStores } from "../../models"
import { MainFeed } from "../../components/main-feed/main-feed"
import moment from "moment"
import { FeedSnapshot } from "../../models/feed-store/feed"
import { MoodSum } from "../../components/mood-sum/mood-sum"
import { CommonButton } from "../../components/common-button/common-button"
import * as StoreReview from "expo-store-review"
import { ColorThemeUtil } from "../../models/colorTheme"
import { SettingOptionIdDefine } from "../../models/setting-option-store/setting-option"

const FULL: ViewStyle = { flex: 1 }

const addIcon = require("./add-icon.png")
const settingIcon = require("./setting-icon.png")
const starIcon = require("./star-icon.png")

interface FeedSection {
  title: string
  data: FeedSnapshot[]
}

export const HomeScreen: FC<StackScreenProps<NavigatorParamList, "home">> = observer(
  ({ navigation, route }) => {
    const { feedStore, settingOptionStore } = useStores()
    const colorTheme = ColorThemeUtil.getColorThemeById(
      settingOptionStore.getSettingOption(SettingOptionIdDefine.colorTheme),
    )
    const insets = useSafeAreaInsets()
    const imageModalDisclosure = useDisclose()
    const DATE_FORMAT = "YYYY-MM-DD"
    const deleteOption = useDisclose()
    const [selectedDate, setSelectedDate] = useState(moment().format(DATE_FORMAT))
    const [firstDayOfCarousel, setFirstDayOfCarousel] = useState(new Date())
    const [streak, setStreak] = useState(0)
    const [selectedImage, setSelectedImage] = useState("")
    const [shouldCongrate, setShouldCongrate] = useState(false)
    const todayFeeds = feedStore.feeds.filter(
      (feed) => moment(feed.id).format(DATE_FORMAT) === selectedDate,
    )
    const isRequireAfterPostAction =
      settingOptionStore.getSettingOption(SettingOptionIdDefine.shouldActionAfterPost) === "true"
    const sectionList = useRef<SectionList>()
    useFocusEffect(
      React.useCallback(() => {
        console.log(
          "isRequireAfterPostAction:",
          settingOptionStore.getSettingOption(SettingOptionIdDefine.shouldActionAfterPost),
        )
        if (isRequireAfterPostAction) {
          scheduleYesterdayResultNoti(todayFeeds).catch((e) => {
            console.log(e)
          })
          console.log("change selectedDate")
          setSelectedDate(moment().format(DATE_FORMAT))
          setShouldCongrate(true)
          settingOptionStore.setSettingOption({
            id: SettingOptionIdDefine.shouldActionAfterPost,
            settingValue: "false",
          })
          // TODO: fix this
          // sectionList?.current?.scrollToLocation({
          //   sectionIndex: 0,
          //   itemIndex: todayFeeds.length - 1,
          // })
          // SettingState.isDailySummary().then((isOk) => {
          //   if (isOk) {

          //   }
          // })
        }
        // AsyncStorage.clear()
        // navigation.navigate("onboardingNoti")
        AsyncStorage.getItem("@onboard01").then((isOnboard) => {
          if (!isOnboard) {
            AsyncStorage.setItem("@onboard01", "1")
            navigation.navigate("onboarding")
          } else {
            AsyncStorage.getItem("@onboard02").then((isOnboard2) => {
              if (!isOnboard2) {
                AsyncStorage.setItem("@onboard02", "1")
                navigation.navigate("onboardingNoti")
              }
            })
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
      const duration = moment.duration(
        moment().isoWeekday(1).diff(moment(feeds[0].id).isoWeekday(1).startOf("day")),
      )
      const weeksCount = Math.floor(duration.asWeeks())
      for (let i = weeksCount; i >= 0; i--) {
        result.push(i)
      }
      return result
    }
    // TODO impl this shit
    const carouselData = getCarouselData(feedStore.feeds)

    const calculateDictionaryFromFeeds = (feeds: FeedSnapshot[]) => {
      const dictionary = new Map<string, FeedSnapshot[]>()
      let streak = 0
      feeds.forEach((feed) => {
        let feedsOfDate = dictionary.get(moment(feed.id).format(DATE_FORMAT))
        if (!feedsOfDate) {
          if (dictionary.get(moment(feed.id).add(-1, "d").format(DATE_FORMAT))) {
            streak += 1
          } else {
            streak = 1
          }
          feedsOfDate = []
          dictionary.set(moment(feed.id).format(DATE_FORMAT), feedsOfDate)
        }
        feedsOfDate.push(feed)
      })

      if (
        !dictionary.get(moment().add(-1, "d").format(DATE_FORMAT)) &&
        !dictionary.get(moment().format(DATE_FORMAT))
      ) {
        streak = 0
      }
      setStreak(streak)

      // request review if streak > 2
      if (streak >= 2) {
        StoreReview.requestReview()
      }
      setFeedsDictionary(dictionary)
    }

    const [feedsDictionary, setFeedsDictionary] = useState<Map<string, FeedSnapshot[]>>(
      new Map<string, FeedSnapshot[]>(),
    )

    useEffect(() => {
      calculateDictionaryFromFeeds(feedStore.feeds)
    }, [feedStore.feeds.length, settingOptionStore.settingOptions])

    // const feedsDictionary = getDictionaryFromFeeds(feedStore.feeds)
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            if (!isFuture) {
              action()
            }
          }}
          flexBasis="14.28%"
          key={date.getDate()}
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
                          colors: [colorTheme.palette.colorful1, colorTheme.palette.colorful2],
                          start: [1, 0],
                          end: [0, 1],
                        },
                      }
                    : "transparent"
                }
                alignItems="center"
              >
                <Text
                  color={isSelected ? colorTheme.palette.accent : colorTheme.palette.mildText}
                  fontSize="md"
                  fontWeight="bold"
                >
                  {moment(date).format("ddd")}
                </Text>
                <Box
                  w="5px"
                  h="5px"
                  bg={isHaveNote ? colorTheme.palette.accent : color.transparent}
                  rounded="full"
                ></Box>
                <Text
                  color={
                    isFuture
                      ? colorTheme.palette.mildText
                      : isSelected
                      ? "white"
                      : colorTheme.palette.text
                  }
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
        <HStack key={"weekhead_" + index}>
          {[...Array(7).keys()].map((dateNum) =>
            DayPick(
              moment()
                .clone()
                .add(-7 * item, "d")
                .isoWeekday(dateNum)
                .add(1, "d")
                .toDate(),
              () => {
                setSelectedDate(
                  moment()
                    .clone()
                    .add(-7 * item, "d")
                    .isoWeekday(dateNum)
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
        <Screen preset="fixed" backgroundColor={colorTheme.palette.background}>
          <ZStack flexGrow={1} flexDirection="column">
            <Flex direction="column" h="100%">
              <Flex direction="column" pb="10px">
                <Box>
                  <Flex
                    pl="10px"
                    pr="10px"
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text color={colorTheme.palette.text} fontSize="md" fontWeight="bold">
                      {moment(new Date(selectedDate)).format("YYYY, dddd MMM DD")}
                    </Text>
                    <HStack alignItems="center">
                      <Text
                        mr="10px"
                        color={colorTheme.palette.milderText}
                        fontWeight="bold"
                        fontSize="xl"
                      >
                        {moment(firstDayOfCarousel).format("MMMM YYYY")}
                      </Text>
                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync()
                          navigation.navigate("setting")
                        }}
                      >
                        <Box
                          // background={colorTheme.palette.backgroundSelected}
                          // borderWidth="1px"
                          // rounded="30px"
                          w="50px"
                          h="50px"
                          // shadow="3"
                        >
                          <LottieView
                            colorFilters={[
                              { keypath: "*.*.Color", color: colorTheme.palette.accent },
                            ]}
                            autoPlay
                            loop={true}
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                              flex: 1,
                            }}
                            // Find more Lottie files at https://lottiefiles.com/featured
                            source={require("./color-spin.json")}
                          />
                        </Box>
                      </Pressable>
                      {/* <CommonButton
                        icon={require("./cog-icon.png")}
                        // text="Setting"
                        onClick={() => {
                          navigation.navigate("setting")
                        }}
                      /> */}
                    </HStack>
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
                    maxW={Dimensions.get("window").width - 20}
                    mt="10px"
                    mr="10px"
                    ml="10px"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text
                      mr="10px"
                      color={colorTheme.palette.text}
                      fontWeight="bold"
                      fontSize="2xl"
                    >
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
              <ZStack
                bg={colorTheme.palette.backgroundShade}
                w="full"
                flexGrow="1"
                justifyContent="flex-end"
              >
                <Flex
                  // borderTopWidth="1"
                  // borderColor={colorTheme.palette.backgroundSelected}
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
                        color={colorTheme.palette.mildText}
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
                            color={colorTheme.palette.text}
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
                      // initialNumToRender={1}
                      onScrollToIndexFailed={() => {}}
                      // getItemLayout={(data) ={}}
                      ref={sectionList}
                      decelerationRate={0.5}
                      showsVerticalScrollIndicator={false}
                      sections={sectionData}
                      removeClippedSubviews={true}
                      renderItem={(item) => {
                        // setSelectedDate(item.section.title)
                        return (
                          <Box
                            key={"main-feed-" + (item.item as FeedSnapshot).id}
                            renderToHardwareTextureAndroid
                            shouldRasterizeIOS
                            // maxW={Dimensions.get("window").width - 20}
                            mt={item.index === 0 ? "10px" : "0px"}
                            mb={item.index === todayFeeds.length - 1 ? "100px" : "0px"}
                          >
                            <MainFeed
                              feed={item.item as FeedSnapshot}
                              onClick={() => {
                                if (todayFeeds[item.index].image !== "") {
                                  setSelectedImage(todayFeeds[item.index].image)
                                  imageModalDisclosure.onOpen()
                                }
                              }}
                              onLongTap={() => {
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
                <Box shadow="9" pt="10px" pb="20px" pl="10px" alignSelf="flex-start">
                  <Pressable
                    onPress={() => {
                      // feedStore.addFeed({
                      //   id: new Date().getTime(),
                      //   emotion: "happy",
                      //   content: "content",
                      //   image: "",
                      //   imageRatio: 1,
                      //   imageBase64: "",
                      // })
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
                              colors: [colorTheme.palette.colorful1, colorTheme.palette.colorful2],
                              start: [1, 0],
                              end: [0, 1],
                            },
                          }}
                          // w="150px"
                          // h="62px"
                          rounded="20px"
                        >
                          <ZStack w="40px" h="40px">
                            <Box w="40px" shadow="4">
                              <Image w="40px" h="40px" source={starIcon} alt="star-icon" />
                            </Box>
                          </ZStack>
                          <VStack>
                            <Text
                              ml="10px"
                              shadow="9"
                              fontSize="md"
                              fontWeight="bold"
                              color="white"
                              textAlign="center"
                            >
                              Streak
                            </Text>
                            <Text
                              ml="10px"
                              fontSize="md"
                              fontWeight="bold"
                              color={colorTheme.palette.accent}
                              textAlign="center"
                            >
                              {streak} day{streak > 1 ? "s" : ""}
                            </Text>
                          </VStack>
                        </Box>
                      )
                    }}
                  </Pressable>
                </Box>
                <Box shadow="9" pt="10px" pb="20px" pr="10px" alignSelf="flex-end">
                  <CommonButton
                    onClick={() => {
                      navigation.navigate("yourday")
                    }}
                    icon={addIcon}
                    text="Add note"
                  />
                </Box>
                {/* <Box shadow="9" pt="10px" pb="20px" pr="10px" alignSelf="flex-end">
                  <CommonButton
                    onClick={() => {
                      navigation.navigate("setting")
                    }}
                    icon={settingIcon}
                  />
                </Box> */}
                {shouldCongrate &&
                  selectedDate === moment().format(DATE_FORMAT) &&
                  todayFeeds.length === 1 && (
                    <AspectRatio alignSelf="center" mb="30%" w="full" ratio={1 / 1}>
                      <VStack
                        bg={colorTheme.palette.backgroundSelected}
                        rounded="30px"
                        w="full"
                        h="full"
                      >
                        <Text
                          mt="30px"
                          textAlign="center"
                          color={colorTheme.palette.text}
                          fontWeight="bold"
                          fontSize="2xl"
                        >
                          First post of the day, keep going
                        </Text>
                        <LottieView
                          speed={0.8}
                          onAnimationFinish={() => {
                            setShouldCongrate(false)
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
                <Actionsheet.Content bg={colorTheme.palette.background}>
                  <Actionsheet.Item
                    rounded="10px"
                    _pressed={{
                      background: colorTheme.palette.backgroundSelected,
                    }}
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
                    <Text fontSize="md" fontWeight="bold" color={colorTheme.palette.text}>
                      Delete
                    </Text>
                  </Actionsheet.Item>
                </Actionsheet.Content>
              </Actionsheet>
            </Flex>
            <Modal visible={imageModalDisclosure.isOpen} transparent={true} animationType="fade">
              <ZStack
                pb={`${insets.bottom}px`}
                pt={`${insets.top}px`}
                bg="#000000"
                w="full"
                h="full"
              >
                <ImageViewer
                  enableSwipeDown
                  failImageSource={require("./icon-404.png")}
                  onSwipeDown={imageModalDisclosure.onClose}
                  imageUrls={[{ url: selectedImage }]}
                />
                <Flex alignSelf="flex-end" pr="20px" mt={`${insets.top + 20}px`}>
                  <Box
                    justifyContent="center"
                    alignItems="center"
                    bg="#222"
                    w="35px"
                    h="35px"
                    rounded="30px"
                  >
                    <IconButton
                      // borderRadius="full"
                      _pressed={{
                        bg: color.transparent,
                      }}
                      p="0"
                      onPress={imageModalDisclosure.onClose}
                      icon={<Ionicons name="close" size={24} color="white" />}
                    ></IconButton>
                  </Box>
                </Flex>
              </ZStack>
            </Modal>
          </ZStack>
        </Screen>
      </View>
    )
  },
)
