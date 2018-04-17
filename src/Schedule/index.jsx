import React from 'react';
import PropTypes from 'prop-types'
import moment from 'moment'

import {
    TimeColumn,
    Column,
    Wrapper,
    Inner,
    Content,
    ColumnHeader,
    Layout,
    Virtual,
    TileStyle,
    TimeSlot,
    LineStyle
} from './style'


const calcPosition = (to, step, from) => {

    to = to.clone()

    if (!from) {
        from = to.clone().subtract(1, 'hour')
        to = to.startOf('day')
    }

    return from.diff(to, 'minutes') * step
}

const Line = props => {

    const {step} = props
    const pos = calcPosition(moment(), step)
    return <LineStyle posY={pos}/>
}

const Tile = props => {

    const {end, start, bg, width, position, step} = props

    const posY = calcPosition(start, step)
    const height = calcPosition(start, step, end)

    return <TileStyle posY={posY}
                      posX={width * position}
                      height={height}
                      width={width}
                      bg={bg}/>

}


const DayHeaderRender = props => {
    const {data} = props
    return <ColumnHeader>{data && data.format('dd')}</ColumnHeader>
}

const calcSize = interval => interval / 60 * 100

const calcOverlaps = () => {

    const counts = {'default': 0}

    return (event, eventList) => {
        const overlapCount = eventList.reduce((count, e, i) => {
            if (e[0].isBetween(event[0], event[1], null, '[)') ||
                e[1].isBetween(event[0], event[1], null, '[)') ||
                event[0].isBetween(e[0], e[1], null, '[)') ||
                event[1].isBetween(e[0], e[1], null, '[)')) {

                count.push(i)
            }

            return count

        }, [])

        let key = 'default'
        if (overlapCount.length > 0) {
            overlapCount.sort()
            key = overlapCount.toString()
            counts[key] = counts[key] === undefined ? 0 : counts[key] + 1
        }

        return {count: overlapCount.length, current: counts[key]}
    }
}

class Schedule extends React.Component {

    render() {

        const {data, value: currentValue, headRender, days: daysCount} = this.props

        const value = currentValue || moment()

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

        const today = moment()
        const overlapCount = calcOverlaps()

        for (let i = 0; i < days.length; i++) {

            const day = days[i]
            //todo: imporve performence using group by index
            const todayEvents = data.filter(value => value[0].isSame(day, 'day'))

            cols.push(<Column>
                {day.isSame(today, 'day') && <Line step={slotSize / timeSlotInterval}/>}
                {todayEvents.map(event => {

                    const {count, current} = overlapCount(event, todayEvents)

                    return <Tile
                        width={100 / count}
                        position={current}
                        bg={'blue'}
                        start={event[0]}
                        end={event[1]}
                        step={slotSize / timeSlotInterval}>tets</Tile>


                })}
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
