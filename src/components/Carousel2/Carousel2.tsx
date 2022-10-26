import React from 'react'

import { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import TokenList from '../../utils/dom/TokenList'

import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.css'

import './Carousel2.css'

export enum IndicatorsType {
  Bullet = 'bullet',
  Dash = 'dash',
}
export type Carousel2Props = React.HTMLProps<HTMLDivElement> & {
  items: Record<string, string>[]
  component: React.ComponentType<{ item: any }>
  dynamicMainBullets?: number
  time?: number | false
  progress?: boolean
  isFullscreen?: boolean
  indicatorsType?: IndicatorsType
}

export default React.memo(function Carousel2({
  className,

  time,
  progress,
  indicatorsType,
  items,
  dynamicMainBullets,
  isFullscreen,
  component: Component,
  ...props
}: Carousel2Props) {
  return (
    <div
      {...props}
      className={TokenList.join([
        'carousel2',
        className,
        isFullscreen && 'fullscreen',
        indicatorsType === IndicatorsType.Dash && 'dash-indicators',
      ])}
    >
      <Swiper
        autoplay={
          !progress
            ? {
                delay: time || 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                stopOnLastSlide: progress,
              }
            : false
        }
        centeredSlides={true}
        containerModifierClass="carousel2__"
        loop={!progress}
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        observer={true}
        observeParents={true}
        pagination={{
          clickable: true,
          dynamicBullets: items.length > 5 && true,
          dynamicMainBullets: dynamicMainBullets || 1,
        }}
        scrollbar={{ draggable: true }}
        slidesPerView={1}
        spaceBetween={50}
        speed={300}
        watchSlidesProgress={true}
      >
        {items.map((item, i) => (
          <SwiperSlide key={i}>
            <Component item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})