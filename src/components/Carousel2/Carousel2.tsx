import React from 'react'

import { Autoplay, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import TokenList from '../../utils/dom/TokenList'

import './Carousel2.css'
import 'swiper/swiper.min.css'
import 'swiper/swiper-bundle.min.css'

export enum IndicatorType {
  Bullet = 'bullet',
  Dash = 'dash',
}
export type Carousel2Props<T = any> = React.HTMLProps<HTMLDivElement> & {
  items: T[]
  component: React.ComponentType<{ item: T }>
  dynamicBullets?: boolean
  dynamicMainBullets?: number
  time?: number | false
  progress?: boolean
  // TODO
  isFullscreen?: boolean
  isNavigationHide?: boolean
  loading?: boolean
  indicatorsType?: IndicatorType
}

export default React.memo(function Carousel2({
  className,
  time,
  progress,
  indicatorsType,
  items,
  dynamicBullets,
  dynamicMainBullets,
  isFullscreen,
  isNavigationHide,
  loading,
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
        isNavigationHide && 'navigation-hide',
        indicatorsType === IndicatorType.Dash && 'dash-indicators',
      ])}
    >
      {loading && <div className="carousel2-loading loading"></div>}
      {!loading && (
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
          navigation={!isNavigationHide}
          pagination={{
            clickable: true,
            dynamicBullets: dynamicBullets ?? (items.length > 5 && true),
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
      )}
    </div>
  )
})
