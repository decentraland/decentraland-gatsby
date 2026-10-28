import React from 'react'

import {
  DownloadModal as BaseDownloadModal,
  DownloadModalProps,
} from 'decentraland-ui2/dist/components/Modal/DownloadModal'
import { renderToStaticMarkup } from 'react-dom/server'

import DownloadModal from './DownloadModal'
import useFormatMessage from '../../hooks/useFormatMessage'

jest.mock('decentraland-ui2/dist/components/Modal/DownloadModal', () => ({
  DownloadModal: jest.fn(() => null),
}))
jest.mock('../../hooks/useFormatMessage')

describe('when rendering the UI2 download modal', () => {
  let props: DownloadModalProps
  let modal: jest.MockedFunction<typeof BaseDownloadModal>

  beforeEach(() => {
    modal = BaseDownloadModal as jest.MockedFunction<typeof BaseDownloadModal>
    ;(useFormatMessage as jest.Mock).mockReturnValue((id: string) =>
      id === '@growth.DownloadModal.title'
        ? 'Localized title'
        : 'Localized download'
    )
    props = {
      open: true,
      os: 'apple',
      downloadUrl: 'https://example.com/installer',
      epicUrl: 'https://example.com/epic',
      googlePlayUrl: 'https://example.com/play',
      appStoreUrl: 'https://example.com/app-store',
      onClose: jest.fn(),
      onDownloadClick: jest.fn(),
      onEpicClick: jest.fn(),
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should forward platform links and callbacks with translated defaults', () => {
    renderToStaticMarkup(<DownloadModal {...props} />)

    expect(modal).toHaveBeenCalledWith(
      {
        ...props,
        i18n: { title: 'Localized title', download: 'Localized download' },
      },
      expect.anything()
    )
  })

  describe('and the caller provides translations', () => {
    beforeEach(() => {
      props.i18n = { title: 'Custom title', downloadOn: 'Custom store label' }
    })

    it('should preserve explicit translations and default the remaining wrapper labels', () => {
      renderToStaticMarkup(<DownloadModal {...props} />)

      expect(modal).toHaveBeenCalledWith(
        expect.objectContaining({
          i18n: {
            title: 'Custom title',
            download: 'Localized download',
            downloadOn: 'Custom store label',
          },
        }),
        expect.anything()
      )
    })
  })
})
