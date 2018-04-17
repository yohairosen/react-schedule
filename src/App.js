import React, {Component} from 'react';
import logo from './logo.svg';
import {Schedule, ColumnHeader} from "./Schedule";
import styled from 'styled-components'
import moment from 'moment'

const data = [
    [moment({hour: 11}), moment({hour: 13, minute:30})],
    [moment({hour: 12}), moment({hour: 13})],
    [moment({hour: 13, minute:45}), moment({hour: 14, minute:30})],
    [moment({hour: 7}).day(2), moment({hour: 10, minutes: 30}).day(2)],
    [moment({hour: 21}).day(3), moment({hour: 23, minutes: 30}).day(3)],
    [moment({ hour: 21}).day(0), moment({hour: 23, minutes: 30}).day(0)],
]
const pData = [
    {name: 'yossi'},
    {name: 'shlomi'}
]
const days = [moment(), moment()]

const Wrapper = styled.div`
  text-align: center;
  height: 100%;
  //position: relative;
  //overflow: hidden;
`
const Header = styled.header`
  background-color: #fff;
  height: 58px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  border-bottom: 2px solid #f1f1f1;
  //overflow: hidden;
`


const Title = styled.h1`
  font-size: 1.5em;
`
const Content = styled.div`
  //overflow: hidden;
  //position: relative;
  //height: 100%;
  //top: 58px;
  //right: 0;
  //left: 0;
  //bottom: 0;
  //min-height: 100%;
  //margin-top: 60px;
      position: relative;
    height: 100%;
    min-height: 100%;
`

const ProviderHeadRender = props => {
    const {data, index} = props
    return <ColumnHeader>{pData[index] && pData[index].name}</ColumnHeader>
}

const App = () => <Wrapper className="app-wrapper">
    <Header>
        <Title>Welcome to React</Title>
    </Header>
    <Content className="content">
        <Schedule
            data={data}
            mode="day"
            value={moment().day(3)}
            // days={3}
            // headRender={ProviderHeadRender}
        />
    </Content>
</Wrapper>


export default App;
