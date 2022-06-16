import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import { Header, Screen, GradientBackground } from "../../components"
import { color, spacing, typography } from "../../theme"
import { NavigatorParamList } from "../../navigators"
import { Feather, Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Camera } from "expo-camera"
import { Box, Text, IconButton, ZStack, Flex } from "native-base"
import { CameraType } from "expo-camera/build/Camera.types"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[0],
}

export const CameraScreen: FC<StackScreenProps<NavigatorParamList, "camera">> = observer(
  ({ navigation, route }) => {
    const [hasPermission, setHasPermission] = useState(null)
    const [type, setType] = useState(CameraType.back)
    const [camera, setCamera] = useState(null)
    const [imageData, setImageData] = useState(null)

    const takePicture = async () => {
      if (camera) {
        const data = await camera.takePictureAsync(null)
        console.log(data)
        navigation.goBack()
        route.params.onGoBack(data)
      }
    }

    useEffect(() => {
      ;(async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === "granted")
      })()
    }, [])

    if (hasPermission === null) {
      return <View />
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>
    }
    return (
      <ZStack flexDirection="column" w="full" h="full">
        <Camera
          ref={(ref) => setCamera(ref)}
          style={{ flex: 1, flexDirection: "column" }}
          type={type}
        ></Camera>
        <Flex w="full" h="full" direction="column" justifyContent="flex-end">
          <Box
            alignSelf="center"
            rounded="full"
            bg={color.palette.background}
            mb="30px"
            w="60px"
            h="60px"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              // borderRadius="full"
              onPress={() => takePicture()}
              icon={<Ionicons name="camera" size={35} color={color.palette.mildText} />}
            ></IconButton>
          </Box>
          <Box
            alignSelf="center"
            rounded="full"
            bg="#00000030"
            mb="30px"
            w="40px"
            h="40px"
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              // borderRadius="full"
              onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
              icon={<Ionicons name="camera-reverse" size={20} color="white" />}
            ></IconButton>
          </Box>
        </Flex>
        <Box
          rounded="full"
          bg="#00000030"
          ml="30px"
          mt="50px"
          w="60px"
          h="60px"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            // borderRadius="full"
            onPress={() => navigation.goBack()}
            icon={<Ionicons name="close" size={35} color="white" />}
          ></IconButton>
        </Box>
      </ZStack>
    )
  },
)
