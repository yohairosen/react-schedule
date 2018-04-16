import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'


const weekDays = moment.weekdaysMin()

const TimeSlot = (props) => {

    const TimeSlotWrapper = styled.div`
        border-top: solid 1px #e0e0e0; 
        height: 1.5em;
        line-height: 25px;
        `

    const {children} = props
    // console.log(children)

    return <TimeSlotWrapper>{children && children.format('HH:mm')}</TimeSlotWrapper>
}

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
const Inner2 = styled.div`

       font-size: 13px;
    color: #000;
    background: #fff;
    display: block;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
`

const Inner3 = styled.div`

       position: relative;
    height: 100%;
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
  //display: flex;
  //overflow-y: scroll;
  padding: .714em .4em;
  line-height: 20px;
  max-height: 54px;
  flex: 1 1 auto;


`
const ColumnContent = styled.div`
  //height: 1.5em;
  //overflow-y: scroll;
`


const Layout = styled.div`
  display: flex;
  //height: 100%;
  //position: absolute;
  //left: 0;
  //top:0;
  //right: 0;
  //bottom: 0;
  //overflow-y: scroll;
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

const Tile = props => {


    const start = (props.start.diff(moment().startOf('day'), 'minutes') / 5 - 1) * 25
    const end = (props.end.diff(props.start, 'minutes') / 5 + 1) * 25

    const TileStyle = styled.div`
    left: 0;
    top:${start}px;
    right:0;
    height: ${end}px;
    position: absolute;
    background: red;
`

    return <TileStyle/>

}


const DayHeaderRender = props => {
    const {data} = props
    return <ColumnHeader>{data && data.format('dd')}</ColumnHeader>
}


const DefaultHeaderRender = props => <ColumnHeader>{props.data}</ColumnHeader>

class Schedule extends React.Component {


    constructor() {
        super()
    }

    render() {

        const {data, value, headRender, mode} = this.props

        const days = mode === 'day' ? data.map(() => value) : weekDays

        const start = value.startOf('day')
        const interval = 5
        const slots = [...new Array(24 * 60 / interval)]
        const rows = slots.map(item => <TimeSlot/>)
        const Head = headRender ? headRender : (mode === 'day' ? DayHeaderRender : DefaultHeaderRender)

        const timeCol =
            <TimeColumn>
                {slots.map(item =>
                    <TimeSlot>
                        {start.add(interval, 'minutes').clone()}
                    </TimeSlot>)}
            </TimeColumn>

        let rowStyle =
            <Column>
                {rows}
            </Column>

        let cols = []
        let colHeads = []

        for (let i = 0; i < days.length; i++) {

            cols.push(<Column>
                <Tile start={moment({hour: 15})} end={moment({hour: 16, minutes: 30})}>tets</Tile>
            </Column>)

            colHeads.push(<Head index={i} data={days[i]}/>)
        }

        return <Wrapper>
            <Inner>
                {/*<Inner2>*/}
                    {/*<Inner3>*/}
                        <Layout style={{marginLeft: 42}}>
                            {colHeads}
                        </Layout>
                        <Content>
                            <Layout>
                                {timeCol} {cols}
                            </Layout>
                            <Virtual>
                                {rowStyle}
                            </Virtual>
                        </Content>
                    {/*</Inner3>*/}
                {/*</Inner2>*/}
            </Inner>

        </Wrapper>

    }


}

Schedule.propTypes = {
    data: PropTypes.array.isRequired
}

export {Schedule, ColumnHeader}
