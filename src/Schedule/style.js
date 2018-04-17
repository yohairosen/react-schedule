import styled from 'styled-components'
import React from 'react'

const TimeColumn = styled.div`
  border-left: solid 1px #e0e0e0;
`

const Column = styled.div`
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

const Inner = styled.div`

    position: absolute;
    top: 61px;
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
    const {posY, height,width, children, bg, posX} = props

    const El = styled.div`
        left: calc(${posX}%);
        top:${posY}px;
        height: ${height}px;
        width: ${width}%;
        position: absolute;
        background: ${bg};
        z-index: 100;
     `
    return <El>{children}</El>
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
    TileStyle
}
