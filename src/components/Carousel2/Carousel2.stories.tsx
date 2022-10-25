import React from 'react'

import Land from '../../utils/api/Land'
import ImgFixed from '../Image/ImgFixed'
import Carousel2, { IndicatorsType } from './Carousel2'

import type { ComponentMeta, ComponentStoryObj } from '@storybook/react'

export default {
  title: 'Components/Carousel2',
  component: Carousel2,
} as ComponentMeta<typeof Carousel2>

const carouselItems = [
  {
    src: Land.get().getParcelImage([-29, 55]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-29, 155]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-129, 55]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-29, 5]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-9, 55]),
    dimension: 'wide',
  },
]

const carouselItemsMany = [...carouselItems, ...carouselItems, ...carouselItems]

const carouselItemsDiffHeight = [
  {
    src: Land.get().getParcelImage([-29, 55]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-29, 155]),
    dimension: 'vertical',
  },
  {
    src: Land.get().getParcelImage([-129, 55]),
    dimension: 'wide',
  },
  {
    src: Land.get().getParcelImage([-29, 5]),
    dimension: 'vertical',
  },
  {
    src: Land.get().getParcelImage([-9, 55]),
    dimension: 'wide',
  },
]

const ComponentCarousel = (props) => (
  <ImgFixed src={props.item.src} dimension={props.item.dimension} />
)

export const Simple: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2 items={carouselItems} component={ComponentCarousel} />
    </div>
  ),
}

export const Many: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2 items={carouselItemsMany} component={ComponentCarousel} />
    </div>
  ),
}

export const Time: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2
        time={1000}
        items={carouselItems}
        component={ComponentCarousel}
      />
    </div>
  ),
}

export const DashIndicator: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2
        indicatorsType={IndicatorsType.Dash}
        items={carouselItems}
        component={ComponentCarousel}
      />
    </div>
  ),
}

export const DashIndicatorMany: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2
        indicatorsType={IndicatorsType.Dash}
        items={carouselItemsMany}
        component={ComponentCarousel}
      />
    </div>
  ),
}

export const DifferentHeight: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2
        items={carouselItemsDiffHeight}
        component={ComponentCarousel}
      />
    </div>
  ),
}

export const Fullscreen: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2
        isFullscreen
        indicatorsType={IndicatorsType.Dash}
        items={carouselItems}
        component={ComponentCarousel}
      />
    </div>
  ),
}

export const Progress: ComponentStoryObj<typeof Carousel2> = {
  render: () => (
    <div style={{ width: '90%', maxWidth: '600px', margin: '0 auto' }}>
      <Carousel2 progress items={carouselItems} component={ComponentCarousel} />
    </div>
  ),
}
