import Image from 'next/image'
import { useRef } from 'react'

import { PhotoCamera } from '@mui/icons-material'
import VideocamIcon from '@mui/icons-material/Videocam'
import { IconButton } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

import { LoadingScreenPercentage } from 'components/LoadingScreenPercentage'

type UploaderProps = {
  multiple?: boolean
  uploadFile: (e: any) => void
  label?: string
  extensionsMessage?: string
  type?: string
  description?: string
}

export default function Uploader({
  uploadFile,
  multiple,
  label,
  extensionsMessage,
  type = 'image',
  description = 'Click para adicionar um arquivo.'
}: UploaderProps) {
  const [uploadPercentage] = useGlobalStore((state) => [state.uploadPercentage])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}

        <div className="mt-2 flex items-center justify-center border border-dashed rounded border-gray-900/25   hover:border-blue-500  hover:bg-slate-100 py-2 px-2">
          {uploadPercentage !== null && uploadPercentage !== undefined ? (
            <LoadingScreenPercentage value={uploadPercentage} />
          ) : (
            <div className="text-center flex flex-col">
              <IconButton onClick={handleIconClick}>
                {type === 'video' && <VideocamIcon />}
                {type === 'image' && <PhotoCamera />}
                {type === 'document' && (
                  <Image
                    src="/excel.png"
                    alt="logo excel"
                    width={25}
                    height={25}
                    style={{
                      maxWidth: '840px',
                      maxHeight: '420px',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </IconButton>
              <label className="flex text-sm leading-6 text-gray-600 pb-1">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple={multiple}
                  onChange={(e) => uploadFile(e)}
                />
              </label>
              <p className="text-xs leading-5 text-gray-600 text-center">
                {description}
              </p>
              {extensionsMessage && (
                <p className="text-xs leading-5 text-gray-600 break-normal">
                  {extensionsMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
