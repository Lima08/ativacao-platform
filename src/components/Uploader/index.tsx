import { PhotoCamera } from '@mui/icons-material'
import { CircularProgress, IconButton } from '@mui/material'
import useGlobalStore from 'store/useGlobalStore'

type UploaderProps = {
  multiple?: boolean
  uploadFile: (e: any) => void
}

export default function Uploader({ uploadFile, multiple }: UploaderProps) {
  const [loading] = useGlobalStore((state) => [state.loading])

  return (
    <div className="mt-6  w-full">
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer rounded-md"
      >
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25   hover:border-blue-500 py-6">
          {loading && <CircularProgress />}
          {!loading && (
            <div className="text-center">
              <IconButton>
                <PhotoCamera />
              </IconButton>
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple={multiple}
                  disabled={loading}
                  onChange={(e) => uploadFile(e)}
                />
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG e JPEG, até 10MB
              </p>
            </div>
          )}
        </div>
      </label>
    </div>
  )
}
