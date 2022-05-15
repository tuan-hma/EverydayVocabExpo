import * as React from "react"
import { Text } from "native-base"

export interface HighlightTextProps {
  content: string
  highlightWord: string
  color: string
  fontSize: string
  fontWeight: string
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function HighlightText(props: HighlightTextProps) {
  const splitted = props.content.split(props.highlightWord)
  return (
    <Text color={props.color} fontSize={props.fontSize} fontWeight={props.fontWeight}>
      {splitted.length === 1 && props.content}
      {splitted.length > 1 &&
        splitted.map((cutted, index) => (
          <>
            {index > 0 && (
              <Text bold italic>
                {props.highlightWord}
              </Text>
            )}
            <Text>{cutted}</Text>
          </>
        ))}
    </Text>
  )
}
