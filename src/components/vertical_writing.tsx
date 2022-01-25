import React, { Component } from 'react'

interface VerticalWritingToken {
  str: string
  isTextCombineUpright: boolean
}

interface VerticalWritingProps {
  text: string
}

export default class VerticalWriting extends Component<VerticalWritingProps> {
  stringToTokens(str: string) {
    return str
      // Convert zenkaku alphabet and number to hankaku alphabet and number
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
      // Convert hankaku hyphen and space to zenkaku hyphen and space
      .replace(/\-/g, '－')
      .replace(/\s/g, '　')
      // Sorts vertical writing sections and horizontal in vertical writing sections.
      .replace(/([a-zA-Z]|\d{1,5})/g, '{$1}')
      .split(/{/)
      .reduce<VerticalWritingToken[]>((results, s) => {
        if (/}/.test(s)) {
          const [before, after] = s.split(/}/)
          results.push({ str: before, isTextCombineUpright: true })
          results.push({ str: after, isTextCombineUpright: false })
        }
        else {
          results.push({ str: s, isTextCombineUpright: false })
        }
        return results
      }, [])
  }

  render() {
    return (
      <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
        {
          this.stringToTokens(this.props.text).map((token, index) => (
            token.isTextCombineUpright ?
              <span key={index} style={{ textCombineUpright: 'all' }}>{token.str}</ span> :
              <span key={index}>{token.str}</span>
          ))
        }
      </span>
    )
  }
}