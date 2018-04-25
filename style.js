import styled from 'styled-components'
import React from 'react'

const TimeColumn = styled.div`
  border-left: solid 1px #e0e0e0;
`

const HoverStyle = styled.div`
      height:${props => props.height}px;
      width:${props => props.width}px;
      background: pink;
      left: 0;
      right: 0;
      top:0;
      position: absolute;
      //z-index: 50000;
      pointer-events: none;
      display: none;
    `
// const HoverStyle = props => {
//
//     const El = styled.div`
//       height:20px;
//       background: blue;
//       left: 0;
//       right: 0;
//       top:${props.posY}px;
//       position: absolute;
//       z-index: 100;
//       display: none;
//     `
//
//     return <El/>
// }

const Column = styled.div`
  //z-index: 120;
  //background: red;
  border-left: solid 1px #e0e0e0;
  flex: 1 1 auto;
  position: relative;
  
`

const Wrapper = styled.div`
        position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
`


const Main = styled.div`
  // &:hover ${HoverStyle} {
  //   display: block;
  // }
  height: 100%;
  position: relative;
`

const Inner = styled.div`

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`

const Content = styled.div`
    overflow: auto;
    position: absolute;
    top:42px;
    bottom: 0;
    left: 0;
    right: 0;

`

const ColumnHeader = styled.div`
  padding: .714em .4em;
  line-height: 20px;
  max-height: 54px;
  flex: 1 1 auto;
  pointer-events: none;


`

const Layout = styled.div`
  display: flex;
`

const Virtual = styled.div`
      //display: flex;
      //background: black;
      //overflow-y: scroll;
  position: absolute; 
  height: 100%;
  left: 0;
  top:0;
  right:0;
  //bottom: 0;
`
//
// const TimeSlot = props => {
//
//     const {size, children} = props
//
//     const el = styled.div`
//         box-sizing:border-box;
//         border-top: solid 1px #e0e0e0;
//         height: ${size}px;
//         `
//     return <el>{children && children.format('HH:mm')}</el>
//
// }


const TimeSlot = (props) => {

    const {size} = props

    const El = styled.div`
        box-sizing:border-box;
        border-top: solid 1px #e0e0e0;
        height: ${size}px;
        `
    const {children} = props

    return <El>{children && children.format('HH:mm')}</El>
}

const TileStyle = props => {
    const {posY, height, width, children, bg, posX, onClick} = props

    const El = styled.div`
        left: calc(${posX}%);
        top:${posY}px;
        height: ${height}px;
        width: ${width}%;
        position: absolute;
        background: ${bg};
        z-index: 100;
     `
    return <El onClick={onClick}>{children}</El>
}

const LineStyle = props => {

    const El = styled.div`
      border-top: solid 1px red;
      left: 0;
      right: 0;
      top:${props.posY}px;
      position: absolute;
      z-index: 100;
    `

    return <El/>
}

export {
    TimeColumn,
    Column,
    Wrapper,
    Inner,
    Content,
    ColumnHeader,
    Layout,
    Virtual,
    TimeSlot,
    TileStyle,
    LineStyle,
    Main,
    HoverStyle
}
