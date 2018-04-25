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
    LineStyle,
    Main,
    HoverStyle
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

class Hover extends React.Component {

    _value = moment()

    componentDidMount() {
        window.addEventListener('mousemove', this.onMouseMove)
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove)
    }

    isInBounds = (x, y, bounds) =>
        x > bounds.left && x < bounds.right &&
        y > bounds.top && y < bounds.bottom

    getGridPosition = (pos, bound, size) => {
        pos = (pos - size / 2)
        return Math.round((pos - bound) / size) * size
    }

    update(mouseX, mouseY, bounds) {

        const {style} = this._el
        const {height, width, offset, onUpdate} = this.props

        // console.log(mouseY, mouseX, bounds)
        style.display = 'none'

        if (!this.isInBounds(mouseX, mouseY, bounds))
            return

        const posY = this.getGridPosition(mouseY, bounds.top, height)
        const posX = offset + this.getGridPosition(mouseX, bounds.left, width)

        style.left = `${posX}px`
        style.top = `${posY}px`
        style.display = 'block'

        const mins = posY * 60 / 100
        const time = this._value.startOf('day').add({hour: 1, minutes: mins})

        this._el.innerHTML = time.format('HH:mm')
        onUpdate(time)
    }

    onMouseMove = e => {
        const {clientX, clientY} = e
        const {getBounds, offset} = this.props
        this.update(clientX, clientY, getBounds())
    }

    render() {
        const {height, width} = this.props
        return <HoverStyle height={height}
                           width={width}
                           innerRef={el => this._el = el}/>

    }
}


const Tile = props => {

    const {end, start, bg, width, position, step, render: Render, onTileClick} = props

    const posY = calcPosition(start, step)
    const height = calcPosition(start, step, end)

    return <TileStyle
        onClick={onTileClick}
        posY={posY}
        posX={width * position}
        height={height}
        width={width}
        bg={bg}>

        {Render && <Render style={{height: '100%'}}/>}
    </TileStyle>

}


const DayHeaderRender = props => {
    const {data} = props
    return <ColumnHeader>{data && data.format('dd')}</ColumnHeader>
}

const calcSize = interval => interval / 60 * 100

const calcOverlaps = (extractEvent) => {

    const counts = {'default': 0}

    return (event, eventList) => {

        const overlapCount = eventList.reduce((count, e, i) => {
            e = extractEvent(e)

            if (e[0].isSame(event[0], 'day')) {
                if (e[0].isBetween(event[0], event[1], null, '[)') ||
                    e[1].isBetween(event[0], event[1], null, '[)') ||
                    event[0].isBetween(e[0], e[1], null, '[)') ||
                    event[1].isBetween(e[0], e[1], null, '[)')) {

                    count.push(i)
                }
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

const defaultExtractEvent = e => e

class Schedule extends React.Component {

    _currentTime = null

    render() {

        const {
            data,
            value: currentValue,
            extractEvent: currentExtractEvent,
            headRender,
            eventRender,
            days: daysCount,
            onEventClick,
            onDateClick
        } = this.props

        const extractEvent = currentExtractEvent || defaultExtractEvent
        const eventClickHandler = onEventClick || (() => {
        })
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
        const timeColumnSize = 36

        const timeCol =
            <TimeColumn>
                {timeDisplay.map(item =>
                    <TimeSlot size={calcSize(timeDisplayInterval)}>
                        {start.add(timeDisplayInterval, 'minutes').clone()}
                    </TimeSlot>)}
            </TimeColumn>

        let rowStyle =
            <Column className="column" name="content">
                {timeSlots.map(item => <TimeSlot size={slotSize}/>)}
            </Column>

        let cols = []
        let colHeads = []

        const today = moment()
        const overlapCount = calcOverlaps(extractEvent)

        for (let i = 0; i < days.length; i++) {

            const day = days[i]

            cols.push(<Column

                onClick={() => {

                    this._currentTime.set({
                        date: day.date(),
                        month: day.month(),
                        year: day.year()
                    })

                    onDateClick(this._currentTime.clone())
                }}


                className="column" name="content">
                {day.isSame(today, 'day') && <Line step={slotSize / timeSlotInterval}/>}

                {data.reduce((list, value, index) => {

                    const event = extractEvent(value)

                    if (event[0].isSame(day, 'day')) {
                        const {count, current} = overlapCount(event, data)

                        list.push(<Tile
                            onTileClick={e => {
                                e.stopPropagation()
                                eventClickHandler(data[index], index)

                            }}
                            width={100 / count}
                            position={current}
                            bg={'#b3e5fc'}
                            start={event[0]}
                            end={event[1]}
                            render={eventRender}
                            step={slotSize / timeSlotInterval}/>)
                    }

                    return list


                }, [])}
            </Column>)

            colHeads.push(<Head index={i} data={days[i]}/>)
        }

        const getBounds = () => {

            let bounds = this._el && this._el.getBoundingClientRect() || {}
            bounds = {
                left: bounds.left + timeColumnSize + 2,
                right: bounds.right,
                top: bounds.top,
                bottom: bounds.bottom,
                width: bounds.width - (timeColumnSize + 2),
                height: bounds.height
            }
            return bounds
        }


        return <Main>
            <Inner>
                <Layout style={{marginLeft: 42}}>
                    {colHeads}
                </Layout>
                <Content>
                    <Hover height={slotSize}
                           offset={timeColumnSize + 2}
                           width={getBounds().width / days.length}
                           getBounds={getBounds}
                           onUpdate={currentTime => this._currentTime = currentTime}
                    />
                    <Virtual>
                        {rowStyle}
                    </Virtual>
                    <Layout
                        innerRef={ref => this._el = ref && ref}>
                        {timeCol} {cols}
                    </Layout>
                </Content>
            </Inner>
        </Main>

    }

}

Schedule.propTypes = {
    data: PropTypes.array.isRequired
}

export {Schedule, ColumnHeader}
