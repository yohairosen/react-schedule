import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'
import styled from 'styled-components'

const weekDays = moment.weekdaysMin()

const TimeSlot = (props) => {

    const {size} = props

    const TimeSlotWrapper = styled.div`
        box-sizing:border-box;
        border-top: solid 1px #e0e0e0; 
        height: ${size}px;
        `

    const {children} = props

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
const ColumnContent = styled.div`
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

const Tile = props => {

    const {start, end, interval, size, reduction} = props

    const startOfDay = start.clone().startOf('day')

    const diff = (d1, d2) => d2.diff(d1, 'minutes') / interval

    const startDiff = diff(startOfDay, start)
    const endDiff = diff(start, end)

    const posY = ((startDiff - reduction) * size)
    const height = (endDiff * size)

    const TileStyle = styled.div`
        left: 0;
        right:0;
        top:${posY}px;
        height: ${height}px;
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

const calcSize = interval => interval / 60 * 100

class Schedule extends React.Component {


    constructor() {
        super()
    }

    render() {

        const {data, value, headRender, mode, days: daysCount} = this.props

        const days = daysCount ?
            [...new Array(daysCount)].map(() => value) :
            [...new Array(7)].map((item, i) => value.clone().day(i))

        const Head = headRender || DayHeaderRender

        const start = value.clone().startOf('day')

        const timeSlotInterval = 15
        const timeDisplayInterval = 60
        const slotSize = calcSize(timeSlotInterval)

        const timeSlots = [...new Array(24 * 60 / timeSlotInterval)]
        const timeDisplay = [...new Array(24 * 60 / timeDisplayInterval)]

        const timeCol =
            <TimeColumn>
                {timeDisplay.map(item =>
                    <TimeSlot size={calcSize(timeDisplayInterval)}>
                        {start.add(timeDisplayInterval, 'minutes').clone()}
                    </TimeSlot>)}
            </TimeColumn>

        let rowStyle =
            <Column>
                {timeSlots.map(item => <TimeSlot size={slotSize}/>)}
            </Column>

        let cols = []
        let colHeads = []

        for (let i = 0; i < days.length; i++) {

            const day = days[i].day()
            //todo: imporve performence using group by index
            const todayEvents = data.filter(value => value[0].day() === day)

            cols.push(<Column>
                {todayEvents.map(event => <Tile
                    start={event[0]}
                    end={event[1]}
                    interval={timeSlotInterval}
                    reduction={timeDisplayInterval / timeSlotInterval}
                    size={slotSize}>tets</Tile>)}
            </Column>)

            colHeads.push(<Head index={i} data={days[i]}/>)
        }

        return <Wrapper>
            <Inner>
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
            </Inner>

        </Wrapper>

    }


}

Schedule.propTypes = {
    data: PropTypes.array.isRequired
}

export {Schedule, ColumnHeader}
